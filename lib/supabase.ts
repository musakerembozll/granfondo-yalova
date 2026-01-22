import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Standard client for general operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for auth operations (SSR compatible)
export function createSupabaseBrowserClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
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
    status: 'published' | 'draft'
    participants: number
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
