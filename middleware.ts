import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const isAdminPath = request.nextUrl.pathname.startsWith("/admin")
    const isLoginPath = request.nextUrl.pathname === "/admin/login"
    const hasSession = request.cookies.has("admin_session")

    if (isAdminPath) {
        if (isLoginPath) {
            // If already logged in and trying to go to login, redirect to dashboard
            if (hasSession) {
                return NextResponse.redirect(new URL("/admin", request.url))
            }
            return NextResponse.next()
        }

        // If trying to access admin pages without session, redirect to login
        if (!hasSession) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/admin/:path*",
}
