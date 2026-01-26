import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const origin = requestUrl.origin

    console.log('Auth callback:', { code: code?.substring(0, 10), error })

    if (error) {
        return NextResponse.redirect(`${origin}/giris?error=${error}`)
    }

    if (code) {
        const cookieStore = await cookies()
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Ignore - might be called from Server Component
                        }
                    },
                },
            }
        )

        try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
                console.error('Exchange error:', exchangeError.message)
                return NextResponse.redirect(`${origin}/giris?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`)
            }

            if (data.session?.user) {
                const user = data.session.user
                console.log('Session created for:', user.email)

                // Create profile if needed using service role
                const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
                if (serviceRoleKey) {
                    const supabaseAdmin = createClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        serviceRoleKey
                    )
                    
                    const { data: existingProfile } = await supabaseAdmin
                        .from('user_profiles')
                        .select('id')
                        .eq('id', user.id)
                        .single()

                    if (!existingProfile) {
                        await supabaseAdmin.from('user_profiles').upsert({
                            id: user.id,
                            email: user.email,
                            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                            provider: user.app_metadata?.provider || 'google',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'id' })
                    }
                }

                return NextResponse.redirect(`${origin}/profil`)
            }
        } catch (err) {
            console.error('Callback error:', err)
            return NextResponse.redirect(`${origin}/giris?error=callback_error`)
        }
    }

    return NextResponse.redirect(`${origin}/giris?error=no_code`)
}
