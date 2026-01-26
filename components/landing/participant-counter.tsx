"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, TrendingUp, Target, Waves, Bike } from "lucide-react"
import { supabase, Event } from "@/lib/supabase"
import { getThemePreset } from "@/lib/theme-presets"

interface ParticipantCounterProps {
    activeEvent?: Event | null
}

export function ParticipantCounter({ activeEvent }: ParticipantCounterProps) {
    // Detect theme
    const themePreset = activeEvent?.theme_preset || 'emerald'
    const theme = getThemePreset(themePreset)
    const isSwimming = activeEvent?.title?.toLowerCase().includes('yüzme') || 
                       activeEvent?.title?.toLowerCase().includes('swimming') ||
                       themePreset === 'blue'
    
    const [count, setCount] = useState(0)
    const [displayCount, setDisplayCount] = useState(0)

    useEffect(() => {
        // Fetch real count from Supabase
        async function fetchCount() {
            const { data } = await supabase
                .from('applications')
                .select('id', { count: 'exact' })

            if (data) {
                setCount(data.length)
            }
        }
        fetchCount()
    }, [])

    // Animate count
    useEffect(() => {
        if (count === 0) return

        const duration = 2000
        const steps = 60
        const increment = count / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= count) {
                setDisplayCount(count)
                clearInterval(timer)
            } else {
                setDisplayCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [count])

    const stats = [
        {
            icon: isSwimming ? <Waves className="h-6 w-6" /> : <Users className="h-6 w-6" />,
            value: displayCount,
            label: isSwimming ? "Kayıtlı Yüzücü" : "Kayıtlı Sporcu",
            suffix: "",
            color: isSwimming ? "text-blue-400" : "text-emerald-400"
        },
        {
            icon: <Target className="h-6 w-6" />,
            value: isSwimming ? 200 : 500,
            label: "Hedef Katılımcı",
            suffix: "",
            color: "text-cyan-400"
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            value: Math.round((displayCount / (isSwimming ? 200 : 500)) * 100),
            label: "Doluluk Oranı",
            suffix: "%",
            color: isSwimming ? "text-sky-400" : "text-yellow-400"
        }
    ]

    return (
        <section className={`py-16 border-y border-white/5 ${
            isSwimming 
                ? 'bg-gradient-to-r from-blue-900/20 via-slate-900 to-cyan-900/20' 
                : 'bg-gradient-to-r from-emerald-900/20 via-slate-900 to-cyan-900/20'
        }`}>
            <div className="container px-4 mx-auto max-w-4xl">
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className={`text-sm uppercase tracking-widest mb-2 ${
                        isSwimming ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                        Canlı İstatistikler
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {isSwimming ? 'Yüzme Kayıtları Devam Ediyor!' : 'Kayıtlar Devam Ediyor!'}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-3 gap-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-3 ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-3xl md:text-5xl font-black ${stat.color} tabular-nums`}>
                                {stat.value}{stat.suffix}
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
