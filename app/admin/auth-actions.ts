"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"

export interface AdminUser {
    id: string
    username: string
    role: 'admin' | 'moderator'
    name: string
}

export async function loginAdmin(username: string, password: string) {
    // Check in admin_users table
    const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password) // In production, use hashed passwords!
        .single()

    if (error || !user) {
        return { success: false, message: 'Kullanıcı adı veya şifre hatalı' }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, role: user.role }
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/login')
}

export async function getAdminSession(): Promise<AdminUser | null> {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')

    if (!session?.value) {
        return null
    }

    try {
        return JSON.parse(session.value) as AdminUser
    } catch {
        return null
    }
}

export async function requireAdmin() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/login')
    }
    return session
}

export async function requireSuperAdmin() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/login')
    }
    if (session.role !== 'admin') {
        redirect('/admin/applications') // Moderators go to applications page
    }
    return session
}
