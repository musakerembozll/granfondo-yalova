import { Bike } from "lucide-react";
import Link from "next/link";
import { SiteSettings } from "@/app/content-actions";

interface FooterProps {
    siteSettings?: SiteSettings
}

export function Footer({ siteSettings }: FooterProps) {
    const email = siteSettings?.contact_email || "info@sporlayalova.com"
    const phone = siteSettings?.contact_phone || "+90 (552) 196 16 77"

    return (
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 mt-auto">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="grid gap-8 md:grid-cols-4 mb-8">
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xl">
                            <Bike className="h-6 w-6 text-emerald-500" /> GranFondo Yalova
                        </div>
                        <p className="text-sm max-w-md">
                            Spor ve doğa tutkunlarını bir araya getiren, Türkiye&apos;nin en prestijli bisiklet organizasyonlarından biri.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Hızlı Erişim</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Ana Sayfa</Link></li>
                            <li><Link href="/hakkinda" className="hover:text-emerald-400 transition-colors">Hakkında</Link></li>
                            <li><Link href="/etkinlikler" className="hover:text-emerald-400 transition-colors">Etkinlikler</Link></li>
                            <li><Link href="/basvuru" className="hover:text-emerald-400 transition-colors">Başvuru Yap</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">İletişim</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/iletisim" className="hover:text-emerald-400 transition-colors">{email}</Link></li>
                            <li>{phone}</li>
                            <li>Yalova, Türkiye</li>
                        </ul>
                    </div>
                </div>

                <div className="text-sm border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span>&copy; 2026 GranFondo Yalova. Tüm hakları saklıdır.</span>
                    <div className="flex items-center gap-4">
                        <Link href="/gizlilik" className="hover:text-emerald-400 transition-colors">
                            Gizlilik Politikası
                        </Link>
                        <span className="text-slate-600">|</span>
                        <Link href="/kullanim-sartlari" className="hover:text-emerald-400 transition-colors">
                            Kullanım Şartları
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
