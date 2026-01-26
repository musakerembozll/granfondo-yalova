"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Trophy, Mountain, Users, Waves, Timer, Medal } from "lucide-react"
import { useCountAnimation } from "@/hooks/use-count-animation"
import { useState, useEffect } from "react"
import { supabase, Event } from "@/lib/supabase"
import { THEME_PRESETS } from "@/lib/theme-presets"

interface InfoSectionProps {
    activeEvent?: Event | null
}

function AnimatedStat({ value, suffix = '', color }: { value: number; suffix?: string; color: string }) {
    const { ref, displayValue } = useCountAnimation({
        end: value,
        suffix,
        duration: 2500
    })

    return (
        <div ref={ref} className={`text-2xl md:text-3xl font-bold`} style={{ color }}>
            {displayValue}
        </div>
    )
}

export function InfoSection({ activeEvent }: InfoSectionProps) {
    // Tema rengini al
    const themePreset = (activeEvent?.theme_preset || 'emerald') as keyof typeof THEME_PRESETS
    const theme = THEME_PRESETS[themePreset] || THEME_PRESETS.emerald
    
    // Varsayılan resim
    const defaultHeroImage = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=1000&fit=crop&q=80'
    const [heroImageUrl, setHeroImageUrl] = useState(activeEvent?.photo_url || defaultHeroImage)

    useEffect(() => {
        if (activeEvent?.photo_url) {
            setHeroImageUrl(activeEvent.photo_url)
            return
        }
        
        const fetchHeroImage = async () => {
            const { data: imageData } = await supabase
                .from('site_images')
                .select('url')
                .eq('key', 'hero_image')
                .single()
            
            if (imageData?.url) {
                setHeroImageUrl(imageData.url)
            }
        }
        
        fetchHeroImage()
    }, [activeEvent])

    // İkon seçimi etkinlik türüne göre
    const isSwimming = themePreset === 'blue'
    const isRunning = themePreset === 'orange'

    const features = isSwimming ? [
        {
            icon: <Waves className="h-6 w-6" style={{ color: theme.primary }} />,
            title: "Açık Su Deneyimi",
            description: "Marmara'nın berrak sularında profesyonel açık su yüzme deneyimi."
        },
        {
            icon: <Users className="h-6 w-6" style={{ color: theme.secondary }} />,
            title: "Her Seviyeye Uygun",
            description: "Amatör ve profesyonel yüzücüler için farklı mesafe seçenekleri."
        },
        {
            icon: <Medal className="h-6 w-6 text-yellow-400" />,
            title: "Ödüller",
            description: "Kategorilerde dereceye girenlere özel ödüller ve madalyalar."
        }
    ] : [
        {
            icon: <Mountain className="h-6 w-6" style={{ color: theme.primary }} />,
            title: "Zorlu Parkurlar",
            description: "Yalova'nın eşsiz doğasında, hem kısa hem uzun parkur seçenekleriyle limitlerini zorla."
        },
        {
            icon: <Users className="h-6 w-6" style={{ color: theme.secondary }} />,
            title: "Binlerce Sporcu",
            description: "Türkiye'nin dört bir yanından gelen bisiklet tutkunlarıyla aynı atmosferi paylaş."
        },
        {
            icon: <Trophy className="h-6 w-6 text-yellow-400" />,
            title: "Büyük Ödüller",
            description: "Genel klasman ve yaş kategorilerinde sürpriz ödüller ve madalyalar seni bekliyor."
        }
    ]

    // İçerik
    const infoTitle = activeEvent?.info_title || 'Pedalların Gücü Doğayla Buluşuyor'
    const infoSubtitle = activeEvent?.info_subtitle || 'GranFondo Yalova, sadece bir yarış değil, aynı zamanda bir bisiklet festivalidir.'
    const infoDescription = activeEvent?.info_description || '2026 yılında dördüncü kez düzenlenecek olan bu organizasyon, amatör ruhla profesyonel bir deneyim yaşatmayı hedefliyor.'

    // Başlık parçalama
    const titleParts = infoTitle.split(/\s+/)
    const midPoint = Math.ceil(titleParts.length / 2)
    const titleLine1 = titleParts.slice(0, midPoint).join(' ')
    const titleLine2 = titleParts.slice(midPoint).join(' ')

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
                            {titleLine1} <br />
                            <span 
                                className="text-transparent bg-clip-text"
                                style={{ 
                                    backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                                }}
                            >
                                {titleLine2}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            {infoSubtitle}
                            {infoDescription && ` ${infoDescription}`}
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
                                    <div 
                                        className="bg-slate-800 p-3 rounded-xl border border-slate-700 transition-all duration-300 group-hover:scale-110"
                                        style={{ 
                                            '--hover-border': `${theme.primary}50`,
                                            '--hover-shadow': theme.primary
                                        } as React.CSSProperties}
                                    >
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-1 transition-colors" style={{ color: 'inherit' }}>{feature.title}</h4>
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
                        {/* Abstract Decor Elements - Dynamic Theme */}
                        <div className={`absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl animate-pulse ${
                            isSwimming ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                        }`} />
                        <div className={`absolute -bottom-10 -left-10 w-64 h-64 rounded-full blur-3xl animate-pulse ${
                            isSwimming ? 'bg-cyan-500/20' : 'bg-cyan-500/20'
                        }`} style={{ animationDelay: '1s' }} />

                        {/* Image Card */}
                        <motion.div
                            className="relative z-10 bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
                            whileHover={{ rotate: 0, scale: 1.02 }}
                            initial={{ rotate: 3 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="aspect-[4/5] bg-slate-700 relative">
                                {/* Dynamic Hero Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                                    style={{ backgroundImage: `url('${heroImageUrl}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="text-4xl font-bold text-white drop-shadow-lg">
                                        {isSwimming ? '#YalovaSu2025' : '#GFY2026'}
                                    </div>
                                    <div className="text-white/90 drop-shadow-md font-medium">Yalova&apos;nın Kalbinde</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats under image with counting animation - Dynamic based on event type */}
                        <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
                            {isSwimming ? (
                                <>
                                    <motion.div
                                        className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_20px_-5px_theme(colors.blue.500)]"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <AnimatedStat value={3000} color="text-blue-400" />
                                        <div className="text-xs text-slate-400 mt-1">M Uzun</div>
                                    </motion.div>
                                    <motion.div
                                        className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_-5px_theme(colors.cyan.500)]"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <AnimatedStat value={1500} color="text-cyan-400" />
                                        <div className="text-xs text-slate-400 mt-1">M Orta</div>
                                    </motion.div>
                                    <motion.div
                                        className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center transition-all duration-300 hover:border-sky-500/50 hover:shadow-[0_0_20px_-5px_theme(colors.sky.500)]"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                    >
                                        <AnimatedStat value={750} color="text-sky-400" />
                                        <div className="text-xs text-slate-400 mt-1">M Kısa</div>
                                    </motion.div>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
