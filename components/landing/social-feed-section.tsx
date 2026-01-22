"use client"

import { motion } from "framer-motion"
import { Instagram, Twitter, Facebook, ExternalLink } from "lucide-react"
import Link from "next/link"

const socialPosts = [
    {
        platform: "instagram",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400",
        text: "2025 GranFondo Yalova başarıyla tamamlandı! 🚴‍♂️ Tüm katılımcılara teşekkürler!",
        likes: 342,
        date: "2 gün önce"
    },
    {
        platform: "instagram",
        image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=400",
        text: "Parkur hazırlıkları devam ediyor. 2026 için sabırsızlanıyoruz! 🏔️",
        likes: 256,
        date: "1 hafta önce"
    },
    {
        platform: "instagram",
        image: "https://images.unsplash.com/photo-1559348349-86f1f65817fe?q=80&w=400",
        text: "Antrenman ipuçları: Tırmanışlara hazırlanmak için yapmanız gerekenler 💪",
        likes: 189,
        date: "2 hafta önce"
    }
]

const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "https://instagram.com/granfondoyalova", color: "hover:text-pink-500" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "https://twitter.com/granfondoyalova", color: "hover:text-blue-400" },
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "https://facebook.com/granfondoyalova", color: "hover:text-blue-600" }
]

export function SocialFeedSection() {
    return (
        <section className="py-24 bg-slate-950">
            <div className="container px-4 mx-auto max-w-6xl">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
                        Bizi Takip Edin
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Sosyal Medya
                    </h2>

                    <div className="flex justify-center gap-4">
                        {socialLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                target="_blank"
                                className={`bg-white/5 border border-white/10 rounded-full p-3 text-slate-400 transition-all ${link.color} hover:border-white/30`}
                            >
                                {link.icon}
                            </Link>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {socialPosts.map((post, index) => (
                        <motion.div
                            key={index}
                            className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={post.image}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <Instagram className="h-5 w-5 text-white" />
                                </div>
                                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-sm">
                                    <span>❤️</span>
                                    <span>{post.likes}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-slate-300 text-sm line-clamp-2">{post.text}</p>
                                <p className="text-slate-500 text-xs mt-2">{post.date}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Link
                        href="https://instagram.com/granfondoyalova"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Tüm paylaşımları gör <ExternalLink className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
