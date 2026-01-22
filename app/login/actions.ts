"use server"

import { cookies } from "next/headers"

export async function login(data: any) {
    // Simple check for demo purposes
    if (data.username === "admin" && data.password === "admin123") {
        const cookieStore = await cookies()
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })
        return { success: true }
    }
    return { success: false }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("admin_session")
}
