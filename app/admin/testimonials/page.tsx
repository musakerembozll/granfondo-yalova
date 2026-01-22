import { getTestimonials } from "@/app/content-actions"
import { TestimonialsManager } from "@/components/admin/testimonials-manager"

export default async function TestimonialsPage() {
    const items = await getTestimonials()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Yorumlar Yönetimi</h1>
                <p className="text-slate-400">Katılımcı yorumları bölümünü yönetin.</p>
            </div>

            <TestimonialsManager items={items} />
        </div>
    )
}
