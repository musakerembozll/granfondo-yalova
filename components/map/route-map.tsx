"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers
const startIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const endIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface RouteMapProps {
    gpxUrl: string
    color: string
    name: string
}

interface TrackPoint {
    lat: number
    lon: number
    ele: number
}

function parseGPX(gpxText: string): TrackPoint[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(gpxText, "text/xml")
    const trkpts = doc.querySelectorAll("trkpt")

    return Array.from(trkpts).map(pt => ({
        lat: parseFloat(pt.getAttribute("lat") || "0"),
        lon: parseFloat(pt.getAttribute("lon") || "0"),
        ele: parseFloat(pt.querySelector("ele")?.textContent || "0")
    }))
}

export function RouteMap({ gpxUrl, color, name }: RouteMapProps) {
    const [points, setPoints] = useState<TrackPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(gpxUrl)
            .then(res => res.text())
            .then(text => {
                const parsed = parseGPX(text)
                setPoints(parsed)
                setLoading(false)
            })
            .catch(err => {
                console.error("GPX yüklenemedi:", err)
                setLoading(false)
            })
    }, [gpxUrl])

    if (loading) {
        return (
            <div className="h-[400px] bg-slate-800/50 rounded-xl flex items-center justify-center">
                <div className="text-slate-400">Harita yükleniyor...</div>
            </div>
        )
    }

    if (points.length === 0) {
        return (
            <div className="h-[400px] bg-slate-800/50 rounded-xl flex items-center justify-center">
                <div className="text-slate-400">Rota verisi bulunamadı</div>
            </div>
        )
    }

    const positions: [number, number][] = points.map(p => [p.lat, p.lon])
    const center = positions[Math.floor(positions.length / 2)]
    const startPoint = positions[0]
    const endPoint = positions[positions.length - 1]

    // Calculate stats
    const maxEle = Math.max(...points.map(p => p.ele))
    const minEle = Math.min(...points.map(p => p.ele))
    const totalClimb = points.reduce((acc, pt, i) => {
        if (i === 0) return 0
        const diff = pt.ele - points[i - 1].ele
        return diff > 0 ? acc + diff : acc
    }, 0)

    return (
        <div className="space-y-4">
            <div className="h-[400px] rounded-xl overflow-hidden border border-white/10">
                <MapContainer
                    center={center}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={positions} color={color} weight={4} />
                    <Marker position={startPoint} icon={startIcon}>
                        <Popup>🚴 Başlangıç - {name}</Popup>
                    </Marker>
                    <Marker position={endPoint} icon={endIcon}>
                        <Popup>🏁 Bitiş - {name}</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Route Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{Math.round(totalClimb)} m</div>
                    <div className="text-sm text-slate-400">Toplam Tırmanış</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{Math.round(maxEle)} m</div>
                    <div className="text-sm text-slate-400">Maksimum Yükseklik</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{Math.round(minEle)} m</div>
                    <div className="text-sm text-slate-400">Minimum Yükseklik</div>
                </div>
            </div>
        </div>
    )
}
