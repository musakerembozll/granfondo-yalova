import { SiteSettingsManager } from "@/components/admin/site-settings-manager"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Site Ayarları & Medya</h1>
                <p className="text-slate-400">
                    Medya dosyalarını, etkinlik bilgilerini, ödeme ve iletişim ayarlarını buradan yönetebilirsiniz.
                </p>
            </div>

            <SiteSettingsManager />
        </div>
    )
}
