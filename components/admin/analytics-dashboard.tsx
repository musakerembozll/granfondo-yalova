"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Globe, Smartphone, Monitor, ArrowUp, ArrowDown, RefreshCw, AlertCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
    totalVisitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: string
    topPages: { path: string; views: number; change: number }[]
    deviceBreakdown: { device: string; percentage: number }[]
    trafficSources: { source: string; visitors: number; percentage: number }[]
    dailyVisitors: { date: string; visitors: number }[]
    isRealData?: boolean
    configError?: string
    error?: string
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

// Device icon mapping
const deviceIcons: { [key: string]: any } = {
    'Mobil': Smartphone,
    'Masaüstü': Monitor,
    'Tablet': Monitor
}

export function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/admin/analytics')
            const analyticsData = await response.json()
            setData(analyticsData)
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchAnalytics()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-12 text-slate-400">
                Veriler yüklenemedi.
            </div>
        )
    }

    const maxVisitors = Math.max(...data.dailyVisitors.map(d => d.visitors))

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-emerald-400" />
                        Analytics
                    </h1>
                    <p className="text-slate-400 mt-1">Site performansı ve ziyaretçi istatistikleri</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="border-white/10 text-slate-400 hover:text-white"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Yenile
                </Button>
            </div>

            {/* Config warning */}
            {(data.configError || !data.isRealData) && (
                <motion.div
                    variants={item}
                    className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3"
                >
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-yellow-400 font-medium">
                            {data.isRealData ? 'Bilgi' : 'Örnek Veriler Gösteriliyor'}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            {data.configError || data.error || 'Google Analytics entegrasyonu için aşağıdaki ortam değişkenlerini Vercel\'e ekleyin:'}
                        </p>
                        {!data.isRealData && !data.configError && (
                            <div className="mt-3 p-3 bg-slate-900/50 rounded-lg text-xs font-mono text-slate-400">
                                <div>GOOGLE_ANALYTICS_PROPERTY_ID=123456789</div>
                                <div>GOOGLE_APPLICATION_CREDENTIALS_JSON={"{"}"type":"service_account",...{"}"}</div>
                            </div>
                        )}
                    </div>
                    <a
                        href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                            <Settings className="h-3 w-3 mr-1" />
                            Ayarla
                        </Button>
                    </a>
                </motion.div>
            )}

            {/* Real data badge */}
            {data.isRealData && (
                <motion.div
                    variants={item}
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2"
                >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-sm">Google Analytics'ten canlı veri gösteriliyor</span>
                </motion.div>
            )}

            {/* Main Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Toplam Ziyaretçi", value: data.totalVisitors.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", change: 15 },
                    { label: "Sayfa Görüntüleme", value: data.pageViews.toLocaleString(), icon: Eye, color: "text-emerald-400", bg: "bg-emerald-500/10", change: 23 },
                    { label: "Hemen Çıkma", value: `%${data.bounceRate}`, icon: MousePointerClick, color: "text-yellow-400", bg: "bg-yellow-500/10", change: -8 },
                    { label: "Ort. Oturum", value: data.avgSessionDuration, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", change: 5 },
                ].map((stat) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.label}
                            variants={item}
                            className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-5 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {stat.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                    {Math.abs(stat.change)}%
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                        </motion.div>
                    )
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Weekly Chart */}
                <motion.div
                    variants={item}
                    className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/50 p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Haftalık Ziyaretçiler</h3>
                    <div className="flex items-end justify-between h-48 gap-2">
                        {data.dailyVisitors.map((day, i) => (
                            <div key={`${day.date}-${i}`} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg relative group cursor-pointer"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.visitors / maxVisitors) * 100}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {day.visitors.toLocaleString()}
                                    </div>
                                </motion.div>
                                <span className="text-xs text-slate-500">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Device Breakdown */}
                <motion.div
                    variants={item}
                    className="rounded-2xl border border-white/5 bg-slate-900/50 p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Cihaz Dağılımı</h3>
                    <div className="space-y-4">
                        {data.deviceBreakdown.map((device) => {
                            const Icon = deviceIcons[device.device] || Monitor
                            return (
                                <div key={device.device}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm text-white">{device.device}</span>
                                        </div>
                                        <span className="text-sm text-emerald-400">{device.percentage}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${device.percentage}%` }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <motion.div
                    variants={item}
                    className="rounded-2xl border border-white/5 bg-slate-900/50 p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">En Çok Ziyaret Edilen Sayfalar</h3>
                    <div className="space-y-3">
                        {data.topPages.map((page, i) => (
                            <div key={page.path} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                                    <span className="text-sm text-white font-mono">{page.path}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">{page.views.toLocaleString()}</span>
                                    <span className={`flex items-center gap-1 text-xs ${page.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {page.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                        {Math.abs(page.change)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Traffic Sources */}
                <motion.div
                    variants={item}
                    className="rounded-2xl border border-white/5 bg-slate-900/50 p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-emerald-400" />
                        Trafik Kaynakları
                    </h3>
                    <div className="space-y-4">
                        {data.trafficSources.map((source) => (
                            <div key={source.source}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">{source.source}</span>
                                    <span className="text-xs text-slate-400">{source.visitors.toLocaleString()} ziyaretçi</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${source.percentage}%` }}
                                        transition={{ delay: 0.3, duration: 0.8 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
