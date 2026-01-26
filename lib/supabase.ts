import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Standard client for general operations - use this everywhere
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
})

// Browser client for auth operations (SSR compatible) - avoid creating multiple instances
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createSupabaseBrowserClient() {
    if (typeof window === 'undefined') {
        // Server-side: create new client each time
        return createBrowserClient(supabaseUrl, supabaseAnonKey)
    }
    
    // Client-side: reuse the same instance
    if (!browserClient) {
        browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
    }
    return browserClient
}

// Types
export interface Application {
    id: string
    full_name: string
    tc_no: string
    email: string
    phone?: string
    birth_date?: string
    gender?: string
    city?: string
    club?: string
    category: 'long' | 'short'
    emergency_name?: string
    emergency_phone?: string
    receipt_url?: string
    status: 'pending' | 'approved' | 'rejected'
    user_id?: string
    created_at: string
}

export interface Event {
    id: string
    title: string
    date: string
    location: string
    status: 'published' | 'draft' | 'cancelled'
    participants: number
    active_event?: boolean
    photo_url?: string
    description?: string
    background_image_url?: string
    theme_color?: string // OKLCH format
    applications_open?: boolean
    short_price?: number
    long_price?: number
    created_at: string
}

export interface UserProfile {
    id: string
    full_name: string
    phone?: string
    gender?: 'male' | 'female'
    birth_date?: string
    created_at: string
    updated_at: string
}
