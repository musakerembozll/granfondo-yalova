import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { getNewsById, getNewsComments } from "@/app/content-actions"
import { NewsComments } from "@/components/landing/news-comments"
import { notFound } from "next/navigation"

export const revalidate = 300

interface Props {
    params: Promise<{ id: string }>
}

export default async function NewsDetailPage({ params }: Props) {
    const { id } = await params
    const news = await getNewsById(id)
    const comments = await getNewsComments(id, true)

    if (!news || !news.is_published) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="container px-4 mx-auto max-w-4xl">
                    {/* Breadcrumb */}
                    <Link
                        href="/haberler"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Tüm Haberler
                    </Link>

                    {/* Article Header */}
                    <article className="space-y-6">
                        {/* Featured Image */}
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                            <img
                                src={news.image_url || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200"}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                            {news.category && (
                                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
                                    {news.category}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(news.published_at || news.created_at).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            {news.read_time && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {news.read_time}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{news.title}</h1>
                            <p className="text-lg text-slate-400">{news.excerpt}</p>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none py-8 border-y border-white/10">
                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {news.content}
                            </div>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center gap-3 pt-8">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                <User className="h-6 w-6 text-slate-950" />
                            </div>
                            <div>
                                <p className="font-medium text-white">GranFondo Yalova</p>
                                <p className="text-sm text-slate-400">Resmi Haberler ve Duyurular</p>
                            </div>
                        </div>
                    </article>

                    {/* Comments Section */}
                    <div className="mt-20 pt-12 border-t border-white/10">
                        <NewsComments newsId={id} initialComments={comments} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
