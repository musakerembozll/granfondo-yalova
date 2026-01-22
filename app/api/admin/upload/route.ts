import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Lazy initialize Supabase admin client
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
    // Verify admin session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const key = formData.get('key') as string

        if (!file || !key) {
            return NextResponse.json({ error: 'File and key are required' }, { status: 400 })
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const ext = file.name.split('.').pop()
        const fileName = `${key}_${Date.now()}.${ext}`
        const filePath = `site-images/${fileName}`

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from('GranFondo Yalova')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return NextResponse.json({
                error: 'Upload failed: ' + uploadError.message
            }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('GranFondo Yalova')
            .getPublicUrl(filePath)

        const publicUrl = urlData.publicUrl

        // Save to site_images table
        await supabaseAdmin
            .from('site_images')
            .upsert({
                key: key,
                url: publicUrl,
                alt_text: key.replace(/_/g, ' ')
            }, { onConflict: 'key' })

        return NextResponse.json({
            success: true,
            url: publicUrl,
            message: 'Görsel başarıyla yüklendi'
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({
            error: 'Upload failed'
        }, { status: 500 })
    }
}
