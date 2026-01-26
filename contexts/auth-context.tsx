"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createSupabaseBrowserClient, UserProfile } from '@/lib/supabase'

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    session: Session | null
    loading: boolean
    signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>
    signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
    signInWithGoogle: () => Promise<{ success: boolean; message?: string }>
    signInWithMicrosoft: () => Promise<{ success: boolean; message?: string }>
    signInWithApple: () => Promise<{ success: boolean; message?: string }>
    signOut: () => Promise<void>
    updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>
    resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createSupabaseBrowserClient()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setLoading(false)
        }
        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                setSession(session)
                setUser(session?.user ?? null)
                if (session?.user) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (!error && data) {
            setProfile(data)
        }
    }

    const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/giris`,
                data: {
                    full_name: profileData.full_name,
                    phone: profileData.phone,
                    gender: profileData.gender,
                    birth_date: profileData.birth_date
                }
            }
        })

        if (error) {
            return { success: false, message: error.message }
        }

        return { success: true, message: 'Kayıt başarılı! E-posta adresinizi kontrol edin.' }
    }

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            if (error.message.includes('Email not confirmed')) {
                return { success: false, message: 'E-posta adresinizi onaylamanız gerekiyor.' }
            }
            return { success: false, message: 'E-posta veya şifre hatalı.' }
        }

        return { success: true }
    }

    // OAuth providers
    const signInWithGoogle = async () => {
        // Use fixed URL to prevent www/non-www mismatch
        const redirectUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? `${window.location.origin}/auth/callback`
            : 'https://www.sporlayalova.com/auth/callback'
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        })
        if (error) return { success: false, message: error.message }
        return { success: true }
    }

    const signInWithMicrosoft = async () => {
        const redirectUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? `${window.location.origin}/auth/callback`
            : 'https://www.sporlayalova.com/auth/callback'
            
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                redirectTo: redirectUrl,
                scopes: 'email profile'
            }
        })
        if (error) return { success: false, message: error.message }
        return { success: true }
    }

    const signInWithApple = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if (error) return { success: false, message: error.message }
        return { success: true }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setSession(null)
    }

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) {
            return { success: false, message: 'Giriş yapmanız gerekiyor.' }
        }

        const { error } = await supabase
            .from('user_profiles')
            .update({
                ...data,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            return { success: false, message: error.message }
        }

        await fetchProfile(user.id)
        return { success: true }
    }

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/sifre-sifirla`
        })

        if (error) {
            return { success: false, message: error.message }
        }

        return { success: true, message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.' }
    }

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            signUp,
            signIn,
            signInWithGoogle,
            signInWithMicrosoft,
            signInWithApple,
            signOut,
            updateProfile,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
