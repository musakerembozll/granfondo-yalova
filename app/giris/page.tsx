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
                    {/* Social Login Buttons - Coming Soon */}
                    {/* OAuth buttons hidden until fully configured */}

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
