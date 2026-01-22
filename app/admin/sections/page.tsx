import { getSectionSettings } from "@/app/content-actions"
import { SectionsManager } from "@/components/admin/sections-manager"

export default async function SectionsPage() {
    const settings = await getSectionSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Bölüm Ayarları</h1>
                <p className="text-slate-400">Ana sayfadaki bölümlerin görünürlüğünü kontrol edin.</p>
            </div>

            <SectionsManager settings={settings} />
        </div>
    )
}
