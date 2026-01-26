"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useState, useRef } from "react"

interface HeroSectionProps {
    eventDate?: string
    subtitle?: string
    ctaText?: string
    videoUrl?: string
    imageUrl?: string
}

export function HeroSection({
    eventDate = "12 Eylül 2026",
    subtitle = "Marmara'nın incisinde, eşsiz doğa ve zorlu parkurlarda pedallamaya hazır mısın? Sınırlarını zorla, efsaneye ortak ol.",
    ctaText = "Hemen Kayıt Ol",
    videoUrl = "https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4",
    imageUrl = "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"
}: HeroSectionProps) {
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [videoError, setVideoError] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    // Parallax effect
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    // Show video if loaded successfully, show image if video failed or still loading
    const showVideo = videoLoaded && !videoError

    return (
        <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background with Parallax */}
            <motion.div
                className="absolute inset-0 bg-slate-950"
                style={{ y: backgroundY }}
            >
                {/* Video */}
                {!videoError && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onCanPlay={() => setVideoLoaded(true)}
                        onLoadedData={() => setVideoLoaded(true)}
                        onError={() => setVideoError(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-60' : 'opacity-0'}`}
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                )}

                {/* Fallback Image - only show if video fails, not while loading */}
                {videoError && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                    />
                )}

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
                <div className="absolute inset-0 bg-slate-950/30" />
            </motion.div>

            <motion.div
                className="container relative z-10 px-4 text-center"
                style={{ y: textY, opacity }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-xl md:text-2xl font-medium text-emerald-400 mb-4 tracking-widest uppercase">
                        {eventDate} • Yalova
                    </h2>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    GRAN FONDO
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 animate-gradient-x">
                        YALOVA 2026
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <Link href="/basvuru">
                        <Button
                            size="lg"
                            className="group h-14 px-8 text-lg rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_0_40px_-5px_theme(colors.emerald.500)] border-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-5px_theme(colors.emerald.400)]"
                        >
                            {ctaText}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link href="/parkur">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 text-white hover:bg-white/15 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40"
                        >
                            Parkuru İncele
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll indicator with bounce animation */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => {
                    document.getElementById('hakkinda')?.scrollIntoView({ behavior: 'smooth' })
                }}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-white/50 uppercase tracking-wider">Keşfet</span>
                    <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center p-2 hover:border-emerald-400/50 transition-colors">
                        <motion.div
                            className="w-1.5 h-3 bg-white rounded-full"
                            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
