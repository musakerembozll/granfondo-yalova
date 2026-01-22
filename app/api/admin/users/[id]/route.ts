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

// DELETE - Delete a user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = await params

    try {
        const supabaseAdmin = getSupabaseAdmin()

        // Delete from user_profiles first
        await supabaseAdmin
            .from('user_profiles')
            .delete()
            .eq('id', userId)

        // Delete from Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('Auth delete error:', authError)
            return NextResponse.json({
                success: false,
                message: 'Kullanıcı profili silindi ancak auth kaydı silinemedi: ' + authError.message
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı başarıyla silindi'
        })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json({
            success: false,
            message: 'Kullanıcı silinemedi'
        }, { status: 500 })
    }
}

// PATCH - Update a user
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = await params
    const body = await request.json()

    try {
        const supabaseAdmin = getSupabaseAdmin()

        // Update user_profiles
        const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .update({
                full_name: body.full_name,
                phone: body.phone,
                gender: body.gender,
                birth_date: body.birth_date,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)

        if (profileError) {
            // If profile doesn't exist, create it
            if (profileError.code === 'PGRST116') {
                await supabaseAdmin
                    .from('user_profiles')
                    .insert({
                        id: userId,
                        full_name: body.full_name,
                        phone: body.phone,
                        gender: body.gender,
                        birth_date: body.birth_date,
                        email: body.email
                    })
            } else {
                throw profileError
            }
        }

        // Update auth metadata if email changed
        if (body.email) {
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                email: body.email,
                user_metadata: { full_name: body.full_name }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı başarıyla güncellendi'
        })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json({
            success: false,
            message: 'Kullanıcı güncellenemedi'
        }, { status: 500 })
    }
}
