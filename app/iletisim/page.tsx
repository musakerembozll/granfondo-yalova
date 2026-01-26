"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitContactMessage } from "@/app/actions"

interface SiteSettings {
    contact_email?: string
    contact_phone?: string
    address?: string
    working_hours?: string
    instagram_url?: string
    facebook_url?: string
    twitter_url?: string
}

export default function IletisimPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    useEffect(() => {
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(() => setSettings({}))
    }, [])

    const contactInfo = [
        { 
            icon: Mail, 
            label: "E-posta", 
            value: settings?.contact_email || "info@sporlayalova.com", 
            href: `mailto:${settings?.contact_email || "info@sporlayalova.com"}` 
        },
        { 
            icon: Phone, 
            label: "Telefon", 
            value: settings?.contact_phone || "+90 (555) 123 45 67", 
            href: `tel:${(settings?.contact_phone || "+905551234567").replace(/\s/g, '')}` 
        },
        { 
            icon: MapPin, 
            label: "Adres", 
            value: settings?.address || "Yalova Merkez, Türkiye", 
            href: "#" 
        },
        { 
            icon: Clock, 
            label: "Çalışma Saatleri", 
            value: settings?.working_hours || "Pazartesi - Cuma: 09:00 - 18:00", 
            href: "#" 
        },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await submitContactMessage(formData)

        if (result.success) {
            setSuccess(true)
            setFormData({ name: "", email: "", subject: "", message: "" })
        }

        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-28 pb-16">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            İletişim
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Sorularınız mı var? Bize ulaşın, en kısa sürede yanıt verelim.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>

                            <div className="space-y-4 mb-8">
                                {contactInfo.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <div key={item.label} className="flex items-start gap-4 p-4 bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-sm">
                                            <div className="bg-emerald-500/10 p-3 rounded-lg">
                                                <Icon className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-400 mb-1">{item.label}</div>
                                                {item.href !== "#" ? (
                                                    <a href={item.href} className="text-white hover:text-emerald-400 transition-colors">
                                                        {item.value}
                                                    </a>
                                                ) : (
                                                    <span className="text-white">{item.value}</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Social Links */}
                            <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
                            <div className="flex gap-4">
                                <a 
                                    href={settings?.instagram_url || "#"} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-900/50 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <Instagram className="h-5 w-5 text-slate-400" />
                                </a>
                                <a 
                                    href={settings?.facebook_url || "#"} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-900/50 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <Facebook className="h-5 w-5 text-slate-400" />
                                </a>
                                <a 
                                    href={settings?.twitter_url || "#"} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-900/50 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <Twitter className="h-5 w-5 text-slate-400" />
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Mesaj Gönderin</h2>

                            {success ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                                    <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-emerald-400 mb-2">Mesajınız Gönderildi!</h3>
                                    <p className="text-slate-400">En kısa sürede size dönüş yapacağız.</p>
                                    <Button
                                        onClick={() => setSuccess(false)}
                                        variant="outline"
                                        className="mt-4 border-white/20"
                                    >
                                        Yeni Mesaj Gönder
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-2">Ad Soyad *</label>
                                            <Input
                                                placeholder="Adınız"
                                                className="bg-slate-950 border-slate-800"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-2">E-posta *</label>
                                            <Input
                                                placeholder="ornek@email.com"
                                                type="email"
                                                className="bg-slate-950 border-slate-800"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Konu *</label>
                                        <Input
                                            placeholder="Mesajınızın konusu"
                                            className="bg-slate-950 border-slate-800"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Mesajınız *</label>
                                        <Textarea
                                            placeholder="Mesajınızı buraya yazın..."
                                            className="bg-slate-950 border-slate-800 min-h-[150px]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            "Gönder"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
