"use client"

import { useState, useEffect } from "react"
import { Cookie, X } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already accepted
        const consent = localStorage.getItem("cookie_consent")
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted")
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "declined")
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
            <div className="max-w-xl mx-auto pointer-events-auto">
                <div className="bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Cookie className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-300">
                                Bu site, deneyiminizi iyileştirmek için çerezler kullanır.
                                <Link href="/gizlilik" className="text-emerald-400 hover:underline ml-1">
                                    Gizlilik Politikası
                                </Link>
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <button
                                    onClick={handleAccept}
                                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Kabul Et
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
                                >
                                    Reddet
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDecline}
                            className="flex-shrink-0 p-1 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
