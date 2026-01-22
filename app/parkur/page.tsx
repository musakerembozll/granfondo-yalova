"use client"

import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Mountain, Download, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { useState } from "react"

// Dynamic import for Leaflet (SSR issue fix)
const RouteMap = dynamic(
    () => import("@/components/map/route-map").then(mod => mod.RouteMap),
    {
        ssr: false,
        loading: () => (
            <div className="h-[400px] bg-slate-800/50 rounded-xl flex items-center justify-center">
                <div className="text-slate-400">Harita yükleniyor...</div>
            </div>
        )
    }
)

export default function ParkurPage() {
    const [activeRoute, setActiveRoute] = useState<"long" | "short">("long")

    const routes = {
        long: {
            id: "long",
            name: "Uzun Parkur",
            distance: "98 km",
            elevation: "1.850 m",
            duration: "4-6 saat",
            difficulty: "Zorlu",
            gpxUrl: "/routes/long-route.gpx",
            color: "#10b981",
            description: "Profesyonel bisikletçiler ve deneyimli sporcular için tasarlanmış zorlu parkur. Yalova'nın en güzel manzaralarını sunan bu rota, Erikli Yaylası üzerinden geçerek 1250 metreye kadar tırmanıyor.",
            highlights: ["Erikli Yaylası (1250m)", "Armutlu geçişi", "Sahil manzarası", "Orman içi yollar"]
        },
        short: {
            id: "short",
            name: "Kısa Parkur",
            distance: "55 km",
            elevation: "850 m",
            duration: "2-3 saat",
            difficulty: "Orta",
            gpxUrl: "/routes/short-route.gpx",
            color: "#06b6d4",
            description: "Amatör bisikletçiler ve festival ruhunu yaşamak isteyenler için ideal parkur. Termal üzerinden Çınarcık'a uzanan bu rota, herkes için uygun zorlukta.",
            highlights: ["Termal geçişi", "Çınarcık sahili", "Köy manzaraları", "Orman yolları"]
        }
    }

    const currentRoute = routes[activeRoute]

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-28 pb-16">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Hero */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Parkur Haritası
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            GranFondo Yalova 2026 için iki farklı parkur seçeneği sunuyoruz.
                            İnteraktif harita üzerinde rotayı inceleyin!
                        </p>
                    </div>

                    {/* Route Selector */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveRoute("long")}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeRoute === "long"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                        >
                            🏔️ Uzun Parkur (98 km)
                        </button>
                        <button
                            onClick={() => setActiveRoute("short")}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeRoute === "short"
                                    ? "bg-cyan-500 text-white"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                        >
                            🚴 Kısa Parkur (55 km)
                        </button>
                    </div>

                    {/* Map */}
                    <div className="mb-8">
                        <RouteMap
                            gpxUrl={currentRoute.gpxUrl}
                            color={currentRoute.color}
                            name={currentRoute.name}
                        />
                    </div>

                    {/* Route Details */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${activeRoute === "long" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                                    }`}>
                                    <Mountain className="h-4 w-4" />
                                    {currentRoute.difficulty}
                                </div>
                                <h2 className="text-2xl font-bold">{currentRoute.name}</h2>
                            </div>
                            <div className="flex gap-3">
                                <a href={currentRoute.gpxUrl} download>
                                    <Button variant="outline" className="border-white/20 hover:bg-white/10">
                                        <Download className="h-4 w-4 mr-2" />
                                        GPX İndir
                                    </Button>
                                </a>
                                <Link href={`/basvuru?parkur=${currentRoute.id}`}>
                                    <Button className={activeRoute === "long" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-cyan-500 hover:bg-cyan-600"}>
                                        Bu Parkura Kayıt Ol
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <p className="text-slate-400 mb-6">{currentRoute.description}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                                <div className={`text-2xl font-bold ${activeRoute === "long" ? "text-emerald-400" : "text-cyan-400"}`}>
                                    {currentRoute.distance}
                                </div>
                                <div className="text-xs text-slate-500 uppercase mt-1">Mesafe</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                                <div className={`text-2xl font-bold ${activeRoute === "long" ? "text-emerald-400" : "text-cyan-400"}`}>
                                    {currentRoute.elevation}
                                </div>
                                <div className="text-xs text-slate-500 uppercase mt-1">Tırmanış</div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                                <div className={`text-2xl font-bold ${activeRoute === "long" ? "text-emerald-400" : "text-cyan-400"}`}>
                                    {currentRoute.duration}
                                </div>
                                <div className="text-xs text-slate-500 uppercase mt-1">Tahmini Süre</div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2">
                            {currentRoute.highlights.map((highlight) => (
                                <span key={highlight} className="px-3 py-1 bg-white/5 rounded-full text-sm text-slate-300">
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex gap-4">
                        <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-blue-400 mb-2">GPX Dosyası Hakkında</h3>
                            <p className="text-slate-400 text-sm">
                                GPX dosyasını indirerek Garmin, Wahoo, veya diğer bisiklet bilgisayarlarınıza yükleyebilirsiniz.
                                Ayrıca Strava, Komoot gibi uygulamalarda da rotayı takip edebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
