"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

interface Testimonial {
    id: string
    name: string
    location: string
    comment: string
    rating: number
    avatar_url?: string
}

interface Props {
    items: Testimonial[]
}

export function TestimonialsSection({ items }: Props) {
    // If no items, don't render section
    if (!items || items.length === 0) {
        return null
    }

    // Get initials from name
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px]" />

            <div className="container px-4 mx-auto max-w-6xl relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
                        Katılımcı Deneyimleri
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Sporcularımız Ne Diyor?
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {items.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Quote className="absolute top-4 right-4 h-8 w-8 text-emerald-500/20" />

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                    {testimonial.avatar_url ? (
                                        <img src={testimonial.avatar_url} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        getInitials(testimonial.name)
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-slate-400">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < testimonial.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-slate-600"
                                            }`}
                                    />
                                ))}
                            </div>

                            <p className="text-slate-300 leading-relaxed">
                                "{testimonial.comment}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
