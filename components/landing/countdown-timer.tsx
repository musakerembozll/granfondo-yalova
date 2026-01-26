"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Event } from "@/lib/supabase"
import { getThemeClasses } from "@/lib/theme-presets"

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

interface CountdownTimerProps {
    targetDate?: string
    activeEvent?: Event | null
}

export function CountdownTimer({ targetDate: targetDateProp = "2026-04-14", activeEvent }: CountdownTimerProps) {
    // Detect theme
    const themePreset = activeEvent?.theme_preset || 'emerald'
    const theme = getThemeClasses(themePreset)
    const isSwimming = activeEvent?.title?.toLowerCase().includes('yüzme') || 
                       activeEvent?.title?.toLowerCase().includes('swimming') ||
                       themePreset === 'blue'
    
    const targetDate = new Date(`${targetDateProp}T08:00:00`).getTime()
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

            if (distance < 0) {
                clearInterval(interval)
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background Gradients - Dynamic Theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-[100px] ${
                    isSwimming ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                }`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px] ${
                    isSwimming ? 'bg-cyan-500/10' : 'bg-cyan-500/10'
                }`} />
            </div>

            <div className="container px-4 text-center relative z-10 mx-auto max-w-4xl">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-white mb-12 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {isSwimming ? 'Yüzme Yarışına Kalan Süre' : 'Büyük Yarışa Kalan Süre'}
                </motion.h2>

                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {Object.entries(timeLeft).map(([label, value], index) => (
                        <motion.div
                            key={label}
                            className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:border-opacity-50 transition-colors ${
                                isSwimming ? 'hover:border-blue-500/50' : 'hover:border-emerald-500/50'
                            }`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="text-3xl md:text-5xl font-black text-white tabular-nums">
                                {String(value).padStart(2, "0")}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-slate-400 mt-2 font-medium">
                                {label === "days" ? "Gün" :
                                    label === "hours" ? "Saat" :
                                        label === "minutes" ? "Dakika" : "Saniye"}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
