"use client"

import { Mountain, Download, Info, Waves } from "lucide-react"
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

interface Props {
    activeEvent: any
}

export function ParkurClient({ activeEvent }: Props) {
    const [activeRoute, setActiveRoute] = useState<"long" | "short">("long")

    const isSwimming = activeEvent?.title?.toLowerCase().includes("yüzme") ||
                       activeEvent?.title?.toLowerCase().includes("swimming") ||
                       activeEvent?.theme_preset === 'blue';

    const cyclingRoutes = {
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
            highlights: ["Erikli Yaylası (1250m)", "Armutlu geçişi", "Sahil manzarası", "Orman içi yollar"],
            icon: Mountain
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
            highlights: ["Termal geçişi", "Çınarcık sahili", "Köy manzaraları", "Orman yolları"],
            icon: Mountain
        }
    }

    const swimmingRoutes = {
        long: {
            id: "long",
            name: "Uzun Parkur (5K)",
            distance: "5000 m",
            elevation: "0 m",
            duration: "1-2 saat",
            difficulty: "Zorlu",
            gpxUrl: "#", // Placeholder
            color: "#3b82f6",
            description: "Deneyimli açık su yüzücüleri için tasarlanmış 5 kilometrelik parkur. Marmara'nın maviliğinde dayanıklılığınızı test edin.",
            highlights: ["Yalova Sahili", "Açık Deniz Deneyimi", "Profesyonel Güvenlik", "Madalya"],
            icon: Waves
        },
        short: {
            id: "short",
            name: "Kısa Parkur (2K)",
            distance: "2000 m",
            elevation: "0 m",
            duration: "45-90 dk",
            difficulty: "Orta",
            gpxUrl: "#", // Placeholder
            color: "#0ea5e9",
            description: "Açık su yüzmeye yeni başlayanlar ve kendini geliştirmek isteyenler için ideal 2 kilometrelik parkur.",
            highlights: ["Kıyı Şeridi", "Başlangıç Seviyesi", "Eğlenceli Rota", "Madalya"],
            icon: Waves
        }
    }

    const routes = isSwimming ? swimmingRoutes : cyclingRoutes
    const currentRoute = routes[activeRoute]
    const RouteIcon = currentRoute.icon

    return (
        <div className="container px-4 mx-auto max-w-6xl">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {isSwimming ? "Yüzme Parkuru" : "Parkur Haritası"}
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    {activeEvent?.title || "Etkinlik"} için parkur detaylarını aşağıda bulabilirsiniz.
                    İnteraktif harita üzerinde rotayı inceleyin!
                </p>
            </div>

            {/* Route Selector */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setActiveRoute("long")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeRoute === "long"
                            ? (isSwimming ? "bg-blue-600 text-white" : "bg-emerald-500 text-white")
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                >
                    {isSwimming ? "🏊‍♂️" : "🏔️"} {routes.long.name}
                </button>
                <button
                    onClick={() => setActiveRoute("short")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeRoute === "short"
                            ? (isSwimming ? "bg-sky-500 text-white" : "bg-cyan-500 text-white")
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                >
                    {isSwimming ? "🏊‍♂️" : "🚴"} {routes.short.name}
                </button>
            </div>

            {/* Map */}
            <div className="mb-8">
                <RouteMap
                    gpxUrl={currentRoute.gpxUrl !== "#" ? currentRoute.gpxUrl : (isSwimming ? "/routes/swimming-route.gpx" : "/routes/long-route.gpx")}
                    color={currentRoute.color}
                    name={currentRoute.name}
                />
            </div>

            {/* Route Details */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                            isSwimming
                                ? (activeRoute === "long" ? "bg-blue-500/20 text-blue-400" : "bg-sky-500/20 text-sky-400")
                                : (activeRoute === "long" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400")
                            }`}>
                            <RouteIcon className="h-4 w-4" />
                            {currentRoute.difficulty}
                        </div>
                        <h2 className="text-2xl font-bold">{currentRoute.name}</h2>
                    </div>
                    <div className="flex gap-3">
                        {!isSwimming && (
                            <a href={currentRoute.gpxUrl} download>
                                <Button variant="outline" className="border-white/20 hover:bg-white/10">
                                    <Download className="h-4 w-4 mr-2" />
                                    GPX İndir
                                </Button>
                            </a>
                        )}
                        <Link href={`/basvuru?parkur=${currentRoute.id}`}>
                            <Button className={
                                isSwimming
                                    ? (activeRoute === "long" ? "bg-blue-600 hover:bg-blue-700" : "bg-sky-500 hover:bg-sky-600")
                                    : (activeRoute === "long" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-cyan-500 hover:bg-cyan-600")
                            }>
                                Bu Parkura Kayıt Ol
                            </Button>
                        </Link>
                    </div>
                </div>

                <p className="text-slate-400 mb-6">{currentRoute.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className={`text-2xl font-bold ${
                            isSwimming
                                ? (activeRoute === "long" ? "text-blue-400" : "text-sky-400")
                                : (activeRoute === "long" ? "text-emerald-400" : "text-cyan-400")
                        }`}>
                            {currentRoute.distance}
                        </div>
                        <div className="text-xs text-slate-500 uppercase mt-1">Mesafe</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className={`text-2xl font-bold ${
                            isSwimming
                                ? (activeRoute === "long" ? "text-blue-400" : "text-sky-400")
                                : (activeRoute === "long" ? "text-emerald-400" : "text-cyan-400")
                        }`}>
                            {currentRoute.elevation}
                        </div>
                        <div className="text-xs text-slate-500 uppercase mt-1">
                            {isSwimming ? "Yükseklik" : "Tırmanış"}
                        </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                        <div className={`text-2xl font-bold ${
                            isSwimming
                                ? (activeRoute === "long" ? "text-blue-400" : "text-sky-400")
                                : (activeRoute === "long" ? "text-emerald-400" : "text-cyan-400")
                        }`}>
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
                    <h3 className="font-semibold text-blue-400 mb-2">
                        {isSwimming ? "Parkur Güvenliği" : "GPX Dosyası Hakkında"}
                    </h3>
                    <p className="text-slate-400 text-sm">
                        {isSwimming
                            ? "Parkur boyunca cankurtaran botları ve kanolar güvenliğinizi sağlamak için hazır bulunacaktır. Güvenlik şamandıralarını takip etmeniz zorunludur."
                            : "GPX dosyasını indirerek Garmin, Wahoo, veya diğer bisiklet bilgisayarlarınıza yükleyebilirsiniz. Ayrıca Strava, Komoot gibi uygulamalarda da rotayı takip edebilirsiniz."
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}
