"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { verifyPassword } from "@/lib/auth/password"
import { createJWT, SessionPayload } from "@/lib/auth/session"

export interface AdminUser {
    id: string
    username: string
    role: 'admin' | 'moderator'
    name: string
}

export async function loginAdmin(username: string, password: string) {
    try {
        // Fetch user from database
        const { data: user, error } = await supabase
            .from('admin_users')
            .select('id, username, password_hash, role, name, is_active')
            .eq('username', username)
            .single()

        if (error || !user) {
            // Log failed attempt (for security monitoring)
            console.warn('[Security] Failed login attempt for username:', username, error)
            return { success: false, message: 'Kullanıcı adı veya şifre hatalı' }
        }

    // Check if account is active
    if (!user.is_active) {
        console.warn('[Security] Login attempt for inactive account:', username)
        return { success: false, message: 'Hesap devre dışı bırakılmış' }
    }

    // Check if password hash exists (migration completed)
    if (!user.password_hash) {
        console.error('[Security] User has no password_hash - migration incomplete:', username)
        return { success: false, message: 'Hesap yapılandırması tamamlanmamış. Lütfen yönetici ile iletişime geçin.' }
    }

    // Verify password using bcrypt (timing-safe comparison)
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
        // Log failed attempt
        console.warn('[Security] Invalid password for username:', username)
        return { success: false, message: 'Kullanıcı adı veya şifre hatalı' }
    }

    // Create JWT token
    const sessionPayload: SessionPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
    }

    const token = await createJWT(sessionPayload)

    // Set secure session cookie with JWT
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: true, // Always use secure cookies
        sameSite: 'strict', // Strict CSRF protection
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    // Update last login timestamp
    await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id)

        // Log successful login
        console.info('[Security] Successful login for username:', username)

        return { success: true, role: user.role }
    } catch (error) {
        console.error('[Security] Login error:', error)
        return { success: false, message: 'Bir hata oluştu. Lütfen tekrar deneyin.' }
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/login')
}

export async function getAdminSession(): Promise<AdminUser | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie?.value) {
        return null
    }

    try {
        // Verify JWT token
        const { verifyJWT } = await import("@/lib/auth/session")
        const payload = await verifyJWT(sessionCookie.value)

        if (!payload) {
            // Token invalid or expired
            return null
        }

        return {
            id: payload.id,
            username: payload.username,
            role: payload.role,
            name: payload.name
        }
    } catch (error) {
        console.error('[Security] Session verification error:', error)
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
