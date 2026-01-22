import { getFaqItems } from "@/app/content-actions"
import { FaqManager } from "@/components/admin/faq-manager"

export default async function FaqPage() {
    const items = await getFaqItems()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">SSS Yönetimi</h1>
                <p className="text-slate-400">Sıkça sorulan sorular bölümünü yönetin.</p>
            </div>

            <FaqManager items={items} />
        </div>
    )
}
