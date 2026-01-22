"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardChartsProps {
    applications: {
        category: string
        status: string
        createdAt: string
    }[]
}

export function DashboardCharts({ applications }: DashboardChartsProps) {
    // Parkur dağılımı
    const categoryData = [
        {
            name: "Uzun Parkur",
            value: applications.filter(a => a.category === "long").length,
            color: "#10b981"
        },
        {
            name: "Kısa Parkur",
            value: applications.filter(a => a.category === "short").length,
            color: "#06b6d4"
        }
    ]

    // Durum dağılımı
    const statusData = [
        {
            name: "Beklemede",
            value: applications.filter(a => a.status === "pending").length,
            color: "#f59e0b"
        },
        {
            name: "Onaylı",
            value: applications.filter(a => a.status === "approved").length,
            color: "#10b981"
        },
        {
            name: "Reddedildi",
            value: applications.filter(a => a.status === "rejected").length,
            color: "#ef4444"
        }
    ]

    // Son 7 günlük başvuru grafiği
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return date.toISOString().split('T')[0]
    })

    const dailyData = last7Days.map(day => {
        const count = applications.filter(a =>
            a.createdAt.split('T')[0] === day
        ).length
        return {
            name: new Date(day).toLocaleDateString('tr-TR', { weekday: 'short' }),
            başvuru: count
        }
    })

    return (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Günlük Başvurular */}
            <Card className="md:col-span-2 bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Son 7 Gün Başvuruları</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="başvuru" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Parkur Dağılımı */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Parkur Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    dataKey="value"
                                    label={({ name, value }) => `${value}`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Durum Dağılımı */}
            <Card className="md:col-span-3 bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Başvuru Durumları</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-6 justify-center">
                        {statusData.map((item, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2"
                                    style={{ backgroundColor: item.color + '30', border: `2px solid ${item.color}` }}
                                >
                                    {item.value}
                                </div>
                                <span className="text-slate-400 text-sm">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
