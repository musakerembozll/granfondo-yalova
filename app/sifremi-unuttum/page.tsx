"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Bike, Loader2, Mail, ArrowLeft, Check } from "lucide-react"

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
    email: z.string().email("Geçerli bir e-posta adresi giriniz.")
})

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError("")

        const result = await resetPassword(values.email)

        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.message || "Bir hata oluştu.")
        }

        setLoading(false)
    }

    if (success) {
        return (
            <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">E-posta Gönderildi</h2>
                        <p className="text-slate-400 mb-6">
                            Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.
                        </p>
                        <Link href="/giris">
                            <Button className="bg-emerald-500 hover:bg-emerald-600">
                                Giriş Sayfasına Dön
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back Link */}
                <Link href="/giris" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Giriş sayfasına dön
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-4">
                        <Bike className="h-8 w-8 text-emerald-500" />
                        GranFondo Yalova
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Şifremi Unuttum</h1>
                    <p className="text-slate-400 mt-2">
                        E-posta adresinizi girin, şifre sıfırlama linki göndereceğiz.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">E-posta Adresi</FormLabel>
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

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-lg font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    "Şifre Sıfırlama Linki Gönder"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </motion.div>
        </main>
    )
}
