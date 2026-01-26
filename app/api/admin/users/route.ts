import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Use service role to bypass RLS
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!serviceRoleKey) {
            // Fallback to anon key if service role not available
            const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            const supabase = createClient(supabaseUrl, anonKey)

            // Get user profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (profilesError) {
                console.error('Profiles error:', profilesError)
            }

            // Get applications
            const { data: applications, error: appsError } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false })

            if (appsError) {
                console.error('Applications error:', appsError)
            }

            return NextResponse.json({
                profiles: profiles || [],
                applications: applications || [],
                usingServiceRole: false
            })
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

        // Get all auth users
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

        if (authError) {
            console.error('Auth users error:', authError)
        }

        // Get user profiles
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (profilesError) {
            console.error('Profiles error:', profilesError)
        }

        // Get applications
        const { data: applications, error: appsError } = await supabaseAdmin
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false })

        if (appsError) {
            console.error('Applications error:', appsError)
        }

        // Combine auth users with profiles
        const authUsers = authData?.users || []
        const usersMap = new Map()

        // Add auth users first
        authUsers.forEach(authUser => {
            usersMap.set(authUser.id, {
                id: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Kullanıcı',
                phone: null,
                gender: null,
                birth_date: null,
                created_at: authUser.created_at,
                updated_at: authUser.updated_at,
                provider: authUser.app_metadata?.provider || 'email',
                applications: []
            })
        })

        // Merge with profiles - profile data should take priority
        if (profiles) {
            profiles.forEach(profile => {
                const existing = usersMap.get(profile.id)
                if (existing) {
                    usersMap.set(profile.id, {
                        ...existing,
                        full_name: profile.full_name || existing.full_name,
                        phone: profile.phone || existing.phone,
                        gender: profile.gender || existing.gender,
                        birth_date: profile.birth_date || existing.birth_date,
                        email: existing.email || profile.email, // Prefer auth email
                        created_at: profile.created_at || existing.created_at,
                        updated_at: profile.updated_at || existing.updated_at,
                        provider: existing.provider || profile.provider
                    })
                } else {
                    usersMap.set(profile.id, {
                        ...profile,
                        applications: []
                    })
                }
            })
        }

        // Add applications
        if (applications) {
            applications.forEach(app => {
                if (app.user_id && usersMap.has(app.user_id)) {
                    const user = usersMap.get(app.user_id)
                    user.applications.push(app)
                }
            })
        }

        return NextResponse.json({
            users: Array.from(usersMap.values()),
            totalAuthUsers: authUsers.length,
            totalProfiles: profiles?.length || 0,
            totalApplications: applications?.length || 0,
            usingServiceRole: true
        })

    } catch (error) {
        console.error('Admin users API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
