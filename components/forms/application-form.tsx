"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { submitApplication } from "@/app/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, CreditCard, Info, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { SiteSettings } from "@/app/content-actions"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Event } from "@/lib/supabase"

interface ApplicationFormProps {
    siteSettings: SiteSettings
    activeEvent?: Event | null
}

const formSchema = z.object({
    fullName: z.string().min(2, { message: "Ad Soyad en az 2 karakter olmalıdır." }),
    email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
    phone: z.string().min(10, { message: "Geçerli bir telefon numarası giriniz." }),
    tcNo: z.string().length(11, { message: "TC Kimlik No 11 haneli olmalıdır." }),
    birthDate: z.string().min(1, { message: "Doğum tarihi seçiniz." }),
    category: z.enum(["long", "short"]),
    gender: z.enum(["male", "female"]),
    bloodType: z.string().optional(),
    club: z.string().optional(),
    emergencyName: z.string().min(2, { message: "Acil durumda aranacak kişi adı gereklidir." }),
    emergencyPhone: z.string().min(10, { message: "Acil durum numarası gereklidir." }),
    receiptUrl: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
        message: "Yarış kurallarını kabul etmelisiniz.",
    }),
})

export function ApplicationForm({ siteSettings, activeEvent }: ApplicationFormProps) {
    // Prices now come from active event only
    const shortPrice = activeEvent?.short_price ?? 500
    const longPrice = activeEvent?.long_price ?? 750
    const router = useRouter()
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const preselectedParkur = searchParams.get("parkur")
    const { user, profile, loading: authLoading } = useAuth()

    const [receiptPreview, setReceiptPreview] = React.useState<string | null>(null)
    const [uploadingReceipt, setUploadingReceipt] = React.useState(false)
    const [existingApplication, setExistingApplication] = React.useState<string | null>(null)
    const [checkingApplication, setCheckingApplication] = React.useState(true)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            tcNo: "",
            club: "",
            emergencyName: "",
            emergencyPhone: "",
            birthDate: "",
            receiptUrl: "",
            terms: false,
            category: preselectedParkur === "long" ? "long" : preselectedParkur === "short" ? "short" : undefined,
        },
    })

    // Check for existing application when user is loaded
    React.useEffect(() => {
        async function checkExistingApplication() {
            if (!user) {
                setCheckingApplication(false)
                return
            }

            const { data } = await supabase
                .from("applications")
                .select("category, status")
                .eq("user_id", user.id)
                .not("status", "eq", "rejected")
                .single()

            if (data) {
                setExistingApplication(data.category)
            }
            setCheckingApplication(false)
        }

        if (!authLoading) {
            checkExistingApplication()
        }
    }, [user, authLoading])

    // Auto-fill form from profile
    React.useEffect(() => {
        if (profile && user) {
            form.setValue("fullName", profile.full_name || "")
            form.setValue("email", user.email || "")
            form.setValue("phone", profile.phone || "")
            form.setValue("birthDate", profile.birth_date || "")
            if (profile.gender) {
                form.setValue("gender", profile.gender as "male" | "female")
            }
        }
    }, [profile, user, form])

    // Set category when URL param changes
    React.useEffect(() => {
        if (preselectedParkur === "long" || preselectedParkur === "short") {
            form.setValue("category", preselectedParkur)
        }
    }, [preselectedParkur, form])

    const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingReceipt(true)
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result as string
            setReceiptPreview(base64)
            form.setValue("receiptUrl", base64)
            setUploadingReceipt(false)
            toast({
                title: "Dekont Yüklendi",
                description: "Ödeme dekontunuz başarıyla eklendi.",
                className: "bg-emerald-500 text-white"
            })
        }
        reader.readAsDataURL(file)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast({
                title: "Giriş Yapmalısınız",
                description: "Başvuru yapabilmek için giriş yapmanız gerekiyor.",
                variant: "destructive"
            })
            return
        }

        try {
            const result = await submitApplication({
                ...values,
                userId: user.id
            })

            if (result.success) {
                toast({
                    title: "Başvuru Alındı! 🚴‍♂️",
                    description: "Kaydınız başarıyla oluşturuldu. E-posta adresinizi kontrol ediniz.",
                    className: "bg-emerald-500 border-none text-white"
                })
                router.push("/profil")
            } else {
                toast({
                    title: "Hata",
                    description: result.message || "Bir sorun oluştu.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Hata",
                description: "Bir sorun oluştu. Lütfen tekrar deneyiniz.",
                variant: "destructive",
            })
        }
    }

    const selectedCategory = form.watch("category")
    const price = selectedCategory === "long" ? `${longPrice} TL` : selectedCategory === "short" ? `${shortPrice} TL` : "---"

    // Show loading while checking auth
    if (authLoading || checkingApplication) {
        return (
            <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </main>
        )
    }

    // Require login
    if (!user) {
        return (
            <main className="min-h-screen bg-slate-950 text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md text-center">
                        <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Giriş Yapmalısınız</h2>
                        <p className="text-slate-400 mb-6">
                            Başvuru yapabilmek için hesabınıza giriş yapmanız gerekiyor.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href="/giris">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                                    Giriş Yap
                                </Button>
                            </Link>
                            <Link href="/kayit">
                                <Button variant="outline" className="w-full border-slate-700">
                                    Hesap Oluştur
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer activeEvent={activeEvent} />
            </main>
        )
    }

    // Already applied
    if (existingApplication) {
        return (
            <main className="min-h-screen bg-slate-950 text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md text-center">
                        <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Zaten Başvuru Yaptınız</h2>
                        <p className="text-slate-400 mb-6">
                            Bu etkinlik için zaten bir başvurunuz bulunuyor ({existingApplication === "long" ? "Uzun Parkur" : "Kısa Parkur"}).
                            Her etkinlik için sadece bir kez başvuru yapabilirsiniz.
                        </p>
                        <Link href="/profil">
                            <Button className="bg-emerald-500 hover:bg-emerald-600">
                                Profilde Başvurularımı Gör
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer activeEvent={activeEvent} />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar />

            <div className="flex-1 container px-4 py-32 max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">GranFondo Yalova 2026 Başvurusu</h1>
                    <p className="text-slate-400">
                        Büyük yarışa katılmak için aşağıdaki formu eksiksiz doldurunuz.
                        <br />
                        <span className="text-emerald-500 font-medium">Erken Kayıt Dönemi: 1 Ocak - 1 Mart 2026</span>
                    </p>

                    {/* Auto-fill notice */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-sm text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        Bazı bilgiler profilinizden otomatik dolduruldu
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold border-b border-slate-800 pb-2">Kişisel Bilgiler</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ad Soyad</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ahmet Yılmaz" {...field} className="bg-slate-950 border-slate-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tcNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>TC Kimlik No</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="12345678901" {...field} className="bg-slate-950 border-slate-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>E-posta</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ornek@email.com" {...field} className="bg-slate-950 border-slate-800" readOnly />
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
                                                <FormLabel>Telefon</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0555 123 45 67" {...field} className="bg-slate-950 border-slate-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Cinsiyet</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="male" className="border-slate-600 text-emerald-500" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal text-slate-300">
                                                                Erkek
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="female" className="border-slate-600 text-emerald-500" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal text-slate-300">
                                                                Kadın
                                                            </FormLabel>
                                                        </FormItem>
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
                                                <FormLabel>Doğum Tarihi</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="bg-slate-950 border-slate-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Race Details */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold border-b border-slate-800 pb-2">Yarış Kategorisi</h3>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parkur Seçimi</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                                        <SelectValue placeholder="Bir parkur seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                    <SelectItem value="short">Kısa Parkur (55km) - {shortPrice} TL</SelectItem>
                                                    <SelectItem value="long">Uzun Parkur (98km) - {longPrice} TL</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-slate-500">
                                                Parkur detaylarını &quot;Parkurlar&quot; sayfasından inceleyebilirsiniz.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="club"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kulüp / Takım (Opsiyonel)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Bağlı olduğunuz kulüp" {...field} className="bg-slate-950 border-slate-800" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold border-b border-slate-800 pb-2">Acil Durum İletişimi</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="emergencyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Acil Durumda Aranacak Kişi</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Yakınızın adı soyadı" {...field} className="bg-slate-950 border-slate-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="emergencyPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Acil Durum Telefonu</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0555 999 88 77" {...field} className="bg-slate-950 border-slate-800" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold border-b border-slate-800 pb-2 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-emerald-400" />
                                    Ödeme Bilgileri
                                </h3>

                                <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/30 rounded-xl p-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <Info className="h-5 w-5 text-emerald-400 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-emerald-400 mb-1">Ödeme Talimatları</h4>
                                            <p className="text-sm text-slate-400">
                                                Aşağıdaki hesaba katılım ücretini yatırıp dekontunuzu yükleyiniz.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-slate-950/50 rounded-lg p-4 border border-white/10">
                                            <div className="text-xs text-slate-500 uppercase mb-1">Banka</div>
                                            <div className="text-white font-medium">{activeEvent?.bank_name || 'Ziraat Bankası'}</div>
                                        </div>
                                        <div className="bg-slate-950/50 rounded-lg p-4 border border-white/10">
                                            <div className="text-xs text-slate-500 uppercase mb-1">Hesap Sahibi</div>
                                            <div className="text-white font-medium">{activeEvent?.account_holder || 'Sporla Yalova Spor Kulübü'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-lg p-4 border border-white/10 mb-4">
                                        <div className="text-xs text-slate-500 uppercase mb-1">IBAN</div>
                                        <div className="text-emerald-400 font-mono font-medium text-lg">
                                            {activeEvent?.iban || 'TR00 0000 0000 0000 0000 0000 00'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30 text-center">
                                            <div className="text-xs text-cyan-400 uppercase mb-1">Kısa Parkur</div>
                                            <div className="text-2xl font-bold text-cyan-400">{shortPrice} TL</div>
                                        </div>
                                        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30 text-center">
                                            <div className="text-xs text-emerald-400 uppercase mb-1">Uzun Parkur</div>
                                            <div className="text-2xl font-bold text-emerald-400">{longPrice} TL</div>
                                        </div>
                                    </div>

                                    {selectedCategory && (
                                        <div className="mt-4 p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                            <p className="text-center text-emerald-400">
                                                Seçtiğiniz parkur için ödemeniz gereken tutar: <span className="font-bold text-lg">{price}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Receipt Upload */}
                                <div className="space-y-3">
                                    <FormLabel>Ödeme Dekontu</FormLabel>
                                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleReceiptUpload}
                                            className="hidden"
                                            id="receipt-upload"
                                        />
                                        <label htmlFor="receipt-upload" className="cursor-pointer">
                                            {receiptPreview ? (
                                                <div className="space-y-4">
                                                    <img
                                                        src={receiptPreview}
                                                        alt="Dekont önizleme"
                                                        className="max-h-48 mx-auto rounded-lg"
                                                    />
                                                    <p className="text-emerald-400 text-sm">✓ Dekont yüklendi - Değiştirmek için tıklayın</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Upload className="h-10 w-10 mx-auto text-slate-500" />
                                                    <div>
                                                        <p className="text-slate-300">Dekont yüklemek için tıklayın</p>
                                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG veya JPEG (max 5MB)</p>
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {uploadingReceipt && (
                                        <p className="text-sm text-slate-400 text-center">Yükleniyor...</p>
                                    )}
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-800 p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-slate-300">
                                                    Yarış kurallarını ve sorumluluk reddi beyanını okudum, kabul ediyorum.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-emerald-500 hover:bg-emerald-600">
                                Başvuruyu Tamamla
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

            <Footer activeEvent={activeEvent} />
        </main>
    )
}
