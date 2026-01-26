import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Calendar, Clock, ArrowLeft, User, Newspaper } from "lucide-react"
import Link from "next/link"
import { getNews } from "@/app/content-actions"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function HaberlerPage() {
    const news = await getNews()

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

                    {news.length === 0 ? (
                        <div className="text-center py-20">
                            <Newspaper className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-slate-400 mb-2">Henüz haber bulunmuyor</h2>
                            <p className="text-slate-500">Yakında haberler eklenecek, takipte kalın!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map((item) => (
                                <Link key={item.id} href={`/haberler/${item.id}`}>
                                    <article
                                        className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all h-full"
                                    >
                                        <div className="relative aspect-video overflow-hidden">
                                            <img
                                                src={item.image_url || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200"}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {item.category && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-4 text-slate-500 text-sm mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(item.published_at || item.created_at).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                {item.read_time && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {item.read_time}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                                {item.title}
                                            </h2>
                                            <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                                {item.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <User className="h-4 w-4" />
                                                GranFondo Yalova
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
