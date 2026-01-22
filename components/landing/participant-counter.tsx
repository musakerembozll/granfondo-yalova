"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, TrendingUp, Target } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function ParticipantCounter() {
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
            icon: <Users className="h-6 w-6" />,
            value: displayCount,
            label: "Kayıtlı Sporcu",
            suffix: "",
            color: "text-emerald-400"
        },
        {
            icon: <Target className="h-6 w-6" />,
            value: 500,
            label: "Hedef Katılımcı",
            suffix: "",
            color: "text-cyan-400"
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            value: Math.round((displayCount / 500) * 100),
            label: "Doluluk Oranı",
            suffix: "%",
            color: "text-yellow-400"
        }
    ]

    return (
        <section className="py-16 bg-gradient-to-r from-emerald-900/20 via-slate-900 to-cyan-900/20 border-y border-white/5">
            <div className="container px-4 mx-auto max-w-4xl">
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-emerald-400 text-sm uppercase tracking-widest mb-2">
                        Canlı İstatistikler
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Kayıtlar Devam Ediyor!
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
