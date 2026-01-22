"use client"

import { motion } from "framer-motion"
import { Users, Calendar, TrendingUp, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardCharts } from "@/components/admin/dashboard-charts"

interface Application {
    id: string;
    fullName: string;
    category: string;
    status: string;
    createdAt: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

interface DashboardClientProps {
    stats: {
        totalApplications: number;
        activeEvents: number;
        recentApplications: Application[];
        allApplications?: Application[];
    }
}

export function AdminDashboardClient({ stats }: DashboardClientProps) {
    const applications = stats.allApplications || stats.recentApplications.map(a => ({ ...a, status: 'pending' }));

    return (
        <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">
                    Sistem durumunu ve etkinlik özetlerini buradan takip edebilirsiniz.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Stat Cards */}
                {[
                    { title: "Toplam Başvuru", value: stats.totalApplications.toString(), label: "Güncel Veri", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { title: "Aktif Etkinlikler", value: stats.activeEvents.toString(), label: "Yayında", icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { title: "Toplam Gelir", value: "₺0", label: "Henüz ödeme yok", icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                    { title: "Sistem Durumu", value: "%100", label: "Tüm servisler aktif", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            variants={item}
                            className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:border-white/10 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className={cn("p-3 rounded-xl", stat.bg)}>
                                    <Icon className={cn("h-6 w-6", stat.color)} />
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-500">{stat.label}</p>

                            {/* Decorative glow */}
                            <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none", stat.color.replace("text", "bg"))} />
                        </motion.div>
                    )
                })}
            </div>

            {/* Charts */}
            <DashboardCharts applications={applications} />

            <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={item} className="h-auto rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-slate-200 mb-4">Son Başvurular</h3>
                    {stats.recentApplications.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
                            Henüz başvuru yok.
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {stats.recentApplications.map((app) => (
                                <li key={app.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-white font-medium">{app.fullName}</p>
                                        <p className="text-xs text-slate-400">{app.category === 'long' ? 'Uzun Parkur' : 'Kısa Parkur'}</p>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </motion.div>
                <motion.div variants={item} className="h-auto rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-slate-200 mb-4">Hızlı Erişim</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <a href="/admin/applications" className="p-4 bg-slate-800/50 rounded-xl text-center hover:bg-slate-700/50 transition-colors">
                            <Users className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                            <span className="text-sm text-slate-300">Başvurular</span>
                        </a>
                        <a href="/admin/events" className="p-4 bg-slate-800/50 rounded-xl text-center hover:bg-slate-700/50 transition-colors">
                            <Calendar className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
                            <span className="text-sm text-slate-300">Etkinlikler</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
