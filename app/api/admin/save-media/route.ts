import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        throw new Error('Supabase credentials not configured')
    }

    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false }
    })
}

export async function POST(request: NextRequest) {
    try {
        // Verify admin session
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('admin_session')

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        const { key, url, alt_text } = await request.json()

        if (!key) {
            return NextResponse.json({ error: 'Key gerekli' }, { status: 400 })
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Check if site_images table exists, create if not
        const { error: tableError } = await supabaseAdmin
            .from('site_images')
            .select('key')
            .limit(1)

        if (tableError && tableError.message.includes('does not exist')) {
            // Table doesn't exist, this shouldn't happen but let's handle it
            return NextResponse.json({ 
                error: 'site_images tablosu bulunamadı. Lütfen veritabanı migration\'ını çalıştırın.' 
            }, { status: 500 })
        }

        // Upsert the media item
        const { error } = await supabaseAdmin
            .from('site_images')
            .upsert({
                key,
                url: url || '',
                alt_text: alt_text || key.replace(/_/g, ' ')
            }, {
                onConflict: 'key'
            })

        if (error) {
            console.error('Save error:', error)
            return NextResponse.json({ 
                error: 'Kaydetme hatası: ' + error.message 
            }, { status: 500 })
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Başarıyla kaydedildi' 
        })

    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json({ 
            error: error?.message || 'Beklenmeyen hata' 
        }, { status: 500 })
    }
}
