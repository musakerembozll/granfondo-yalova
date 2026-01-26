import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Vercel free tier limit is 4.5MB for request body
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB to be safe

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
    try {
        // Verify admin session
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('admin_session')

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        let formData: FormData
        try {
            formData = await request.formData()
        } catch (e) {
            return NextResponse.json({ 
                error: 'Dosya çok büyük. Maksimum 4MB yükleyebilirsiniz. Video için harici URL kullanın.' 
            }, { status: 413 })
        }
        const file = formData.get('file') as File
        const key = formData.get('key') as string

        if (!file || !key) {
            return NextResponse.json({ error: 'Dosya ve anahtar gerekli' }, { status: 400 })
        }

        // Check file type
        const isVideo = file.type.startsWith('video/')
        const isImage = file.type.startsWith('image/')
        
        if (!isVideo && !isImage) {
            return NextResponse.json({ 
                error: 'Sadece resim ve video dosyaları yüklenebilir' 
            }, { status: 400 })
        }

        // Vercel has 4.5MB body size limit on free/hobby tier
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ 
                error: `Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimum 4MB. Video için YouTube/Pexels URL kullanın.` 
            }, { status: 400 })
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const ext = file.name.split('.').pop()
        const folder = isVideo ? 'videos' : 'site-images'
        const fileName = `${key}_${Date.now()}.${ext}`
        const filePath = `${folder}/${fileName}`

        // Upload to Supabase Storage - use bucket name without spaces
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from('granfondo-media')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            
            // Check if bucket doesn't exist
            if (uploadError.message.includes('not found') || uploadError.message.includes('Bucket')) {
                // Try to create the bucket
                const { error: createError } = await supabaseAdmin.storage.createBucket('granfondo-media', {
                    public: true
                })
                
                if (!createError) {
                    // Retry upload
                    const { error: retryError } = await supabaseAdmin.storage
                        .from('granfondo-media')
                        .upload(filePath, buffer, {
                            contentType: file.type,
                            upsert: true
                        })
                    
                    if (retryError) {
                        return NextResponse.json({
                            error: 'Yükleme başarısız: ' + retryError.message
                        }, { status: 500 })
                    }
                } else {
                    return NextResponse.json({
                        error: 'Storage bucket oluşturulamadı. Lütfen Supabase Dashboard\'dan manuel olarak oluşturun.'
                    }, { status: 500 })
                }
            } else {
                return NextResponse.json({
                    error: 'Yükleme başarısız: ' + uploadError.message
                }, { status: 500 })
            }
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
            .from('granfondo-media')
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
            message: isVideo ? 'Video başarıyla yüklendi' : 'Görsel başarıyla yüklendi'
        })

    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({
            error: error?.message || 'Yükleme sırasında beklenmeyen bir hata oluştu'
        }, { status: 500 })
    }
}
