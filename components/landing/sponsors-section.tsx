"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface Sponsor {
    id: string
    name: string
    logo_url: string
    website?: string
    order_index: number
}

interface Props {
    items: Sponsor[]
}

export function SponsorsSection({ items }: Props) {
    // If no sponsors, don't render section
    if (!items || items.length === 0) {
        return null
    }

    // Check if logo_url is emoji or actual URL
    const isEmoji = (str: string) => {
        return str.length <= 4 && !/^http/.test(str)
    }

    return (
        <section className="py-16 bg-slate-950 border-t border-white/5">
            <div className="container px-4 mx-auto max-w-6xl">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-2">
                        Destekçilerimiz
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Sponsorlarımız
                    </h2>
                </motion.div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                    {items.map((sponsor, index) => {
                        const content = (
                            <motion.div
                                key={sponsor.id}
                                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {isEmoji(sponsor.logo_url) ? (
                                    <div className="text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                                        {sponsor.logo_url}
                                    </div>
                                ) : (
                                    <img
                                        src={sponsor.logo_url}
                                        alt={sponsor.name}
                                        className="h-12 w-auto mb-2 grayscale group-hover:grayscale-0 transition-all object-contain"
                                    />
                                )}
                                <span className="text-xs text-slate-500 text-center group-hover:text-slate-300 transition-colors">
                                    {sponsor.name}
                                </span>
                            </motion.div>
                        )

                        return sponsor.website ? (
                            <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noopener noreferrer">
                                {content}
                            </a>
                        ) : (
                            <div key={sponsor.id}>{content}</div>
                        )
                    })}
                </div>

                <motion.p
                    className="text-center text-slate-500 text-sm mt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Sponsor olmak için{" "}
                    <Link href="/iletisim" className="text-emerald-400 hover:underline">
                        bizimle iletişime geçin
                    </Link>
                </motion.p>
            </div>
        </section>
    )
}
