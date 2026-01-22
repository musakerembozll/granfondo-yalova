import { getAllNews } from "@/app/content-actions"
import { NewsManager } from "@/components/admin/news-manager"

export default async function NewsPage() {
    const items = await getAllNews()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Haberler & Blog</h1>
                <p className="text-slate-400">Blog yazıları ve duyuruları yönetin.</p>
            </div>

            <NewsManager items={items} />
        </div>
    )
}
