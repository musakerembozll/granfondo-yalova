"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface NewsItem {
    id: string
    title: string
    excerpt: string
    image_url: string
    category: string
    read_time?: string
    published_at?: string
}

interface Props {
    items: NewsItem[]
}

export function NewsSection({ items }: Props) {
    // Show max 3 items on homepage
    const displayItems = items.slice(0, 3)

    if (displayItems.length === 0) {
        return null
    }

    return (
        <section className="py-24 bg-slate-900">
            <div className="container px-4 mx-auto max-w-6xl">
                <motion.div
                    className="flex items-center justify-between mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div>
                        <h3 className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
                            Güncel Haberler
                        </h3>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Blog & Duyurular
                        </h2>
                    </div>
                    <Link
                        href="/haberler"
                        className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Tümünü Gör <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {displayItems.map((item, index) => (
                        <motion.article
                            key={item.id}
                            className="group bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/haberler/${item.id}`}>
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={item.image_url || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600'}
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
                                            {item.published_at ? new Date(item.published_at).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long'
                                            }) : ''}
                                        </span>
                                        {item.read_time && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {item.read_time}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2">
                                        {item.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-10 md:hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Link
                        href="/haberler"
                        className="inline-flex items-center gap-2 text-emerald-400"
                    >
                        Tüm haberleri gör <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
