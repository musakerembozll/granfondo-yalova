"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Bike, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    password: z.string().min(1, "Şifre giriniz.")
})

export default function LoginPage() {
    const router = useRouter()
    const { signIn, signInWithGoogle, signInWithMicrosoft, signInWithApple } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState<string | null>(null)
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError("")

        const result = await signIn(values.email, values.password)

        if (result.success) {
            router.push("/profil")
        } else {
            setError(result.message || "Giriş yapılamadı.")
        }

        setLoading(false)
    }

    const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
        setSocialLoading(provider)
        setError("")

        let result
        if (provider === 'google') {
            result = await signInWithGoogle()
        } else if (provider === 'microsoft') {
            result = await signInWithMicrosoft()
        } else {
            result = await signInWithApple()
        }

        if (!result.success) {
            setError(result.message || "Giriş yapılamadı.")
            setSocialLoading(null)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-4">
                        <Bike className="h-8 w-8 text-emerald-500" />
                        GranFondo Yalova
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Giriş Yap</h1>
                    <p className="text-slate-400 mt-2">
                        Hesabınıza giriş yapın
                    </p>
                </div>

                {/* Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    {/* Google Login Button */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading || !!socialLoading}
                        className="w-full h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white mb-4"
                    >
                        {socialLoading === 'google' ? (
                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                        ) : (
                            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Google ile Giriş Yap
                    </Button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900 text-slate-500">veya e-posta ile</span>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">E-posta</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                                <Input
                                                    type="email"
                                                    placeholder="ornek@email.com"
                                                    {...field}
                                                    className="bg-slate-950 border-slate-800 pl-10"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-slate-300">Şifre</FormLabel>
                                            <Link href="/sifremi-unuttum" className="text-sm text-emerald-400 hover:text-emerald-300">
                                                Şifremi Unuttum
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="bg-slate-950 border-slate-800 pl-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading || !!socialLoading}
                                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-lg font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Giriş Yapılıyor...
                                    </>
                                ) : (
                                    "Giriş Yap"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Hesabınız yok mu?{" "}
                        <Link href="/kayit" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}
