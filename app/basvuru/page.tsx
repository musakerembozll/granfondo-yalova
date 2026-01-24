import Link from "next/link"
import { Bike, Bell, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getActiveEvent } from "@/app/actions"
import { getSiteSettings } from "@/app/content-actions"
import { ApplicationForm } from "@/components/forms/application-form"

export const revalidate = 30

export default async function ApplicationPage() {
    const activeEvent = await getActiveEvent()
    const siteSettings = await getSiteSettings()
    
    // Use active event's applications_open status, or default to false
    const applicationsOpen = activeEvent?.applications_open ?? false
    
    if (!applicationsOpen) {
        return (
            <main className="min-h-screen bg-slate-950 text-white flex flex-col">
                <Navbar />

                <div className="flex-1 flex items-center justify-center px-4 py-32">
                    <div className="max-w-2xl text-center">
                        {/* Icon */}
                        <div className="relative inline-block mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                                <Clock className="h-12 w-12 text-amber-400" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500/30 rounded-full flex items-center justify-center">
                                <Bell className="h-4 w-4 text-amber-300 animate-pulse" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                Başvurular Henüz Açılmadı
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-slate-400 mb-8 max-w-lg mx-auto">
                            GranFondo Yalova 2026 etkinliği için başvurular yakında açılacaktır.
                            Başvurular açıldığında size e-posta ile bildirim göndereceğiz.
                        </p>

                        {/* Info Box */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Calendar className="h-5 w-5 text-emerald-400" />
                                <span className="text-slate-300">Etkinlik tarihi yakında duyurulacak</span>
                            </div>
                            <p className="text-sm text-slate-500">
                                Başvuru tarihleri ve etkinlik detayları için web sitemizi takip etmeye devam edin.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/kayit">
                                <Button
                                    size="lg"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                                >
                                    <Bell className="h-4 w-4 mr-2" />
                                    Hesap Oluştur & Bildirim Al
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8"
                                >
                                    <Bike className="h-4 w-4 mr-2" />
                                    Ana Sayfaya Dön
                                </Button>
                            </Link>
                        </div>

                        {/* Already Registered */}
                        <p className="mt-8 text-slate-500 text-sm">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/giris" className="text-emerald-400 hover:text-emerald-300">
                                Giriş yapın
                            </Link>
                            {" "}ve başvurular açıldığında ilk siz haberdar olun.
                        </p>
                    </div>
                </div>

                <Footer />
            </main>
        )
    }

    // If applications are open, show the regular form
    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />
            <div className="flex-1 pt-28 pb-16">
                <div className="container px-4 mx-auto max-w-4xl">
                    <ApplicationForm 
                        siteSettings={siteSettings}
                        activeEvent={activeEvent}
                    />
                </div>
            </div>
            <Footer />
        </main>
    )
}
