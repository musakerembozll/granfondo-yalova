import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getNewsById, getNewsComments, getSiteSettings } from "@/app/content-actions"
import { CommentSection } from "@/components/landing/comment-section"
import { notFound } from "next/navigation"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

const staticNews = [
    {
        id: "1",
        title: "GranFondo Yalova 2026 Kayıtları Açıldı!",
        excerpt: "Türkiye'nin en prestijli bisiklet yarışı için kayıtlar başladı. Erken kayıt indirimleri için acele edin!",
        content: `
GranFondo Yalova 2026 için kayıtlar resmen başladı! Bu yıl 12 Eylül'da gerçekleştirilecek olan etkinlik için şimdiden yerinizi ayırtabilirsiniz.

## Erken Kayıt Fırsatı

31 Ocak'a kadar yapılan kayıtlarda %20 indirim fırsatını kaçırmayın. Erken kayıt yapan sporcularımıza özel hediyeler de verilecektir.

## Parkur Seçenekleri

- **Uzun Parkur (98 km)**: Deneyimli bisikletçiler için zorlu tırmanışlar
- **Kısa Parkur (55 km)**: Orta seviye sporcular için ideal

Kayıt olmak için [buraya tıklayın](/basvuru).
        `,
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
        date: "2026-01-15",
        readTime: "3 dk",
        category: "Duyuru",
        author: "GranFondo Yalova"
    },
    {
        id: "2",
        title: "Yeni Parkur Rotası Açıklandı",
        excerpt: "Bu yıl uzun parkurda yeni tırmanışlar ve muhteşem manzara noktaları sizi bekliyor.",
        content: `
2026 yılı için parkur rotamızı güncelledik! Yeni güzergah, daha zorlu tırmanışlar ve daha güzel manzaralar sunuyor.

## Yeni Tırmanışlar

Uzun parkurda toplam 1.850 metre tırmanış bulunuyor. Bu yıl eklenen "Erikli Tepesi" tırmanışı, yarışın en zorlu bölümlerinden biri olacak.

## İkmal Noktaları

Her 20 km'de bir ikmal noktası bulunacak. Su, meyve ve enerji jeli temin edilecektir.
        `,
        image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200",
        date: "2026-01-10",
        readTime: "5 dk",
        category: "Parkur",
        author: "GranFondo Yalova"
    },
    {
        id: "3",
        title: "Antrenman Rehberi: Gran Fondo'ya Hazırlık",
        excerpt: "Uzman koçlarımızdan yarışa hazırlanmak için ipuçları ve 12 haftalık antrenman programı.",
        content: `
Gran Fondo yarışına katılmayı düşünüyorsanız, iyi bir hazırlık programı şart. İşte uzmanlarımızdan öneriler:

## 12 Haftalık Program

- **Hafta 1-4**: Aerobik baz geliştirme
- **Hafta 5-8**: Tırmanış antrenmanları
- **Hafta 9-11**: Yarış temposu çalışmaları
- **Hafta 12**: Dinlenme ve hazırlık

## Beslenme Önerileri

Yarış öncesi karbonhidrat yüklemesi yapın. Yarış sırasında her 45 dakikada bir enerji alımı önemlidir.
        `,
        image: "https://images.unsplash.com/photo-1559348349-86f1f65817fe?q=80&w=1200",
        date: "2026-01-05",
        readTime: "8 dk",
        category: "Antrenman",
        author: "GranFondo Yalova"
    }
]

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const siteSettings = await getSiteSettings()

    // Check static
    let newsItem: any = staticNews.find(n => n.id === id)

    // If not static, try DB
    if (!newsItem) {
        try {
            newsItem = await getNewsById(id)
        } catch (e) {
            console.error("Error fetching news:", e)
        }
    }

    if (!newsItem) {
        notFound()
    }

    // Adapt newsItem structure if from DB vs Static
    // Static has "date", "image". DB might have "published_at", "image_url".
    const displayItem = {
        id: newsItem.id,
        title: newsItem.title,
        content: newsItem.content,
        image: newsItem.image || newsItem.image_url,
        date: newsItem.date || newsItem.published_at,
        category: newsItem.category,
        author: newsItem.author || "GranFondo Yalova",
        readTime: newsItem.readTime || newsItem.read_time || "3 dk"
    }

    // Fetch comments
    // Note: getNewsComments likely returns [] if table doesn't exist
    const comments = await getNewsComments(id)

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            {/* Hero Image */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
                <img
                    src={displayItem.image}
                    alt={displayItem.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 pb-12">
                    <div className="container px-4 mx-auto max-w-4xl">
                        <Link
                            href="/haberler"
                            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Haberlere Dön
                        </Link>

                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                {displayItem.category}
                            </span>
                            <span className="flex items-center gap-1 text-slate-300 text-sm">
                                <Calendar className="h-4 w-4" />
                                {new Date(displayItem.date).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {displayItem.title}
                        </h1>

                        <div className="flex items-center gap-6 text-slate-300">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {displayItem.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {displayItem.readTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container px-4 mx-auto max-w-4xl py-12">
                <article className="prose prose-invert prose-lg max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
                        {displayItem.content}
                    </div>
                </article>

                {/* Comment Section */}
                <CommentSection newsId={id} comments={comments} />
            </div>

            <Footer siteSettings={siteSettings} />
        </main>
    )
}
