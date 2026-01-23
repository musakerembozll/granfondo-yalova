"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAdmin } from "@/app/admin/auth-actions"
import { useToast } from "@/components/ui/use-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    username: z.string().min(1, "Kullanıcı adı gereklidir."),
    password: z.string().min(1, "Şifre gereklidir."),
})

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const result = await loginAdmin(values.username, values.password)
            if (result.success) {
                toast({
                    title: "Giriş Başarılı",
                    description: "Yönlendiriliyorsunuz...",
                    className: "bg-emerald-500 border-none text-white",
                })
                // Redirect is handled by the server action or router here
                window.location.href = "/admin"
            } else {
                toast({
                    title: "Giriş Başarısız",
                    description: result.message || "Kullanıcı adı veya şifre hatalı.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Hata",
                description: "Bir sorun oluştu.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Girişi</h1>
                    <p className="mt-2 text-slate-400">Yönetim paneline erişmek için giriş yapın.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Kullanıcı Adı</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                            <Input placeholder="admin" {...field} className="bg-slate-950 border-slate-800 pl-10 text-white" />
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
                                    <FormLabel className="text-slate-300">Şifre</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                            <Input type="password" placeholder="••••••••" {...field} className="bg-slate-950 border-slate-800 pl-10 text-white" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 font-bold text-lg" disabled={loading}>
                            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-xs text-slate-500">
                    <p>Güvenli Giriş Sistemi v2.0</p>
                </div>
            </div>
        </div>
    )
}
