import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import Link from "next/link"

const allNews = [
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

export default function HaberlerPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Ana Sayfa
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Haberler & Duyurular</h1>
                        <p className="text-slate-400 text-lg">
                            GranFondo Yalova hakkında en güncel haberler ve duyurular
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allNews.map((item) => (
                            <article
                                key={item.id}
                                className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-4 text-slate-500 text-sm mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(item.date).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {item.readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                        {item.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <User className="h-4 w-4" />
                                        {item.author}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
