import { getGalleryItems } from "@/app/content-actions"
import { GalleryManager } from "@/components/admin/gallery-manager"

export default async function GalleryPage() {
    const items = await getGalleryItems()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Galeri Yönetimi</h1>
                <p className="text-slate-400">Ana sayfadaki galeri fotoğraflarını yönetin.</p>
            </div>

            <GalleryManager items={items} />
        </div>
    )
}
