"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Trophy, Mountain, Users } from "lucide-react"
import { useCountAnimation } from "@/hooks/use-count-animation"

function AnimatedStat({ value, suffix = '', color }: { value: number; suffix?: string; color: string }) {
    const { ref, displayValue } = useCountAnimation({
        end: value,
        suffix,
        duration: 2500
    })

    return (
        <div ref={ref} className={`text-2xl md:text-3xl font-bold ${color}`}>
            {displayValue}
        </div>
    )
}

export function InfoSection() {
    const features = [
        {
            icon: <Mountain className="h-6 w-6 text-emerald-400" />,
            title: "Zorlu Parkurlar",
            description: "Yalova'nın eşsiz doğasında, hem kısa hem uzun parkur seçenekleriyle limitlerini zorla."
        },
        {
            icon: <Users className="h-6 w-6 text-cyan-400" />,
            title: "Binlerce Sporcu",
            description: "Türkiye'nin dört bir yanından gelen bisiklet tutkunlarıyla aynı atmosferi paylaş."
        },
        {
            icon: <Trophy className="h-6 w-6 text-yellow-400" />,
            title: "Büyük Ödüller",
            description: "Genel klasman ve yaş kategorilerinde sürpriz ödüller ve madalyalar seni bekliyor."
        }
    ]

    return (
        <section id="hakkinda" className="py-24 bg-slate-900 text-white overflow-hidden">
            <div className="container px-4 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            Pedalların Gücü <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Doğayla Buluşuyor</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            GranFondo Yalova, sadece bir yarış değil, aynı zamanda bir bisiklet festivalidir.
                            2026 yılında dördüncü kez düzenlenecek olan bu organizasyon, amatör ruhla
                            profesyonel bir deneyim yaşatmayı hedefliyor.
                        </p>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex gap-4 items-start group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_-5px_theme(colors.emerald.500)]">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-1 group-hover:text-emerald-400 transition-colors">{feature.title}</h4>
                                        <p className="text-slate-400">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Link href="/parkur">
                            <Button className="mt-10 rounded-full h-12 px-8 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 transition-all duration-300 hover:scale-105 group">
                                Daha Fazla Bilgi
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Abstract Decor Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                        {/* Image Card */}
                        <motion.div
                            className="relative z-10 bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
                            whileHover={{ rotate: 0, scale: 1.02 }}
                            initial={{ rotate: 3 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="aspect-[4/5] bg-slate-700 relative">
                                {/* Placeholder for About Image */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559348349-86f1f65817fe?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="text-4xl font-bold text-white">#GFY2026</div>
                                    <div className="text-white/80">Yalova&apos;nın Kalbinde</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats under image with counting animation */}
                        <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
                            <motion.div
                                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_-5px_theme(colors.emerald.500)]"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <AnimatedStat value={98} color="text-emerald-400" />
                                <div className="text-xs text-slate-400 mt-1">KM Uzun</div>
                            </motion.div>
                            <motion.div
                                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_-5px_theme(colors.cyan.500)]"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <AnimatedStat value={55} color="text-cyan-400" />
                                <div className="text-xs text-slate-400 mt-1">KM Kısa</div>
                            </motion.div>
                            <motion.div
                                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:border-yellow-500/50 hover:shadow-[0_0_20px_-5px_theme(colors.yellow.500)]"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <AnimatedStat value={4} suffix="." color="text-yellow-400" />
                                <div className="text-xs text-slate-400 mt-1">Yıl</div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
