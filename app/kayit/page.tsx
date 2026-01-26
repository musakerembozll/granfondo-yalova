"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Bike, Eye, EyeOff, Loader2, HelpCircle, Mail, User, Phone, Calendar } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"

const genderOptions = ["male", "female"] as const

const formSchema = z.object({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır."),
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz."),
    gender: z.enum(genderOptions, { message: "Cinsiyet seçiniz." }),
    birthDate: z.string().min(1, "Doğum tarihi seçiniz."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"]
})

export default function RegisterPage() {
    const router = useRouter()
    const { signUp, signInWithGoogle } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            birthDate: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError("")

        const result = await signUp(values.email, values.password, {
            full_name: values.fullName,
            phone: values.phone,
            gender: values.gender,
            birth_date: values.birthDate
        })

        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.message || "Bir hata oluştu.")
        }

        setLoading(false)
    }

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true)
        setError("")
        const result = await signInWithGoogle()
        if (!result.success) {
            setError(result.message || "Google ile kayıt olunamadı.")
            setGoogleLoading(false)
        }
        // If successful, user will be redirected by OAuth flow
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
                            <Mail className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">E-posta Onayı Gerekli</h2>
                        <p className="text-slate-400 mb-6">
                            Hesabınızı aktifleştirmek için e-posta adresinize gönderilen linke tıklayın.
                        </p>
                        <Link href="/giris">
                            <Button className="bg-emerald-500 hover:bg-emerald-600">
                                Giriş Sayfasına Git
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-4">
                        <Bike className="h-8 w-8 text-emerald-500" />
                        GranFondo Yalova
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Hesap Oluştur</h1>
                    <p className="text-slate-400 mt-2">
                        Yarışlara katılmak için hesap oluşturun
                    </p>
                </div>

                {/* Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    {/* Google Sign Up Button */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignUp}
                        disabled={loading || googleLoading}
                        className="w-full h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white mb-6"
                    >
                        {googleLoading ? (
                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                        ) : (
                            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Google ile Kayıt Ol
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
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Ad Soyad</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                                <Input
                                                    placeholder="Ahmet Yılmaz"
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
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Telefon</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                                <Input
                                                    placeholder="0555 123 45 67"
                                                    {...field}
                                                    className="bg-slate-950 border-slate-800 pl-10"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Cinsiyet</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="male" id="male" className="border-slate-600 text-emerald-500" />
                                                        <label htmlFor="male" className="text-slate-300 text-sm">Erkek</label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="female" id="female" className="border-slate-600 text-emerald-500" />
                                                        <label htmlFor="female" className="text-slate-300 text-sm">Kadın</label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300">Doğum Tarihi</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        className="bg-slate-950 border-slate-800 pl-10"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Şifre</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="bg-slate-950 border-slate-800 pr-10"
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

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Şifre Tekrar</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="bg-slate-950 border-slate-800"
                                            />
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
                                disabled={loading || googleLoading}
                                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-lg font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Kayıt Yapılıyor...
                                    </>
                                ) : (
                                    "Hesap Oluştur"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/giris" className="text-emerald-400 hover:text-emerald-300 font-medium">
                            Giriş Yap
                        </Link>
                    </div>
                </div>

                {/* Help Center Button */}
                <div className="mt-6 text-center">
                    <Link href="/iletisim">
                        <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Yardım Merkezi
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </main>
    )
}
