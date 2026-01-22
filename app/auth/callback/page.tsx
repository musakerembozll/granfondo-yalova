"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get session from URL hash
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Auth callback error:', error)
                    router.push('/giris?error=auth_failed')
                    return
                }

                if (session?.user) {
                    // Create/update user profile for OAuth users
                    const user = session.user

                    // Check if profile exists
                    const { data: existingProfile } = await supabase
                        .from('user_profiles')
                        .select('id')
                        .eq('id', user.id)
                        .single()

                    if (!existingProfile) {
                        // Create profile for new OAuth user
                        await supabase
                            .from('user_profiles')
                            .upsert({
                                id: user.id,
                                email: user.email,
                                full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
                                provider: user.app_metadata?.provider || 'oauth',
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            }, { onConflict: 'id' })
                    }

                    // Redirect to profile page
                    router.push('/profil')
                } else {
                    router.push('/giris')
                }
            } catch (err) {
                console.error('Callback processing error:', err)
                router.push('/giris?error=callback_error')
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Giriş yapılıyor...</p>
                <p className="text-slate-400 text-sm mt-2">Lütfen bekleyin</p>
            </div>
        </div>
    )
}
