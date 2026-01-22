"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, RefreshCw, Image, Video, ExternalLink, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { updateSiteSettings, SiteSettings } from "@/app/content-actions"

interface SiteImage {
    id: string
    key: string
    url: string
    alt_text: string
    label: string
}

const defaultImages: SiteImage[] = [
    {
        id: 'hero_video',
        key: 'hero_video',
        url: 'https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4',
        alt_text: 'Hero Video',
        label: 'Ana Sayfa Video'
    },
    {
        id: 'hero_image',
        key: 'hero_image',
        url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop',
        alt_text: 'Hero Fallback',
        label: 'Ana Sayfa Yedek Görsel'
    },
    {
        id: 'about_bg',
        key: 'about_bg',
        url: '',
        alt_text: 'About Background',
        label: 'Hakkında Arka Plan'
    },
    {
        id: 'parkur_bg',
        key: 'parkur_bg',
        url: '',
        alt_text: 'Parkur Background',
        label: 'Parkur Arka Plan'
    }
]

const defaultSettings: SiteSettings = {
    event_date: "2026-04-14",
    short_price: 500,
    long_price: 750,
    iban: "TR12 0001 0012 3456 7890 1234 56",
    bank_name: "Ziraat Bankası",
    account_holder: "GranFondo Yalova Spor Kulübü",
    contact_email: "info@granfondoyalova.com",
    contact_phone: "+90 226 123 45 67"
}

export function SiteSettingsManager() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
    const [siteImages, setSiteImages] = useState<SiteImage[]>(defaultImages)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savingImages, setSavingImages] = useState(false)
    const [uploadingKey, setUploadingKey] = useState<string | null>(null)

    useEffect(() => {
        fetchSettings()
        fetchSiteImages()
    }, [])

    const fetchSettings = async () => {
        const { data } = await supabase
            .from("site_settings")
            .select("*")
            .single()

        if (data) {
            setSettings(data)
        }
        setLoading(false)
    }

    const fetchSiteImages = async () => {
        const { data } = await supabase
            .from("site_images")
            .select("*")

        if (data && data.length > 0) {
            // Merge with defaults
            const merged = defaultImages.map(def => {
                const found = data.find((d: any) => d.key === def.key)
                return found ? { ...def, ...found } : def
            })
            setSiteImages(merged)
        }
    }

    const saveSettings = async () => {
        setSaving(true)

        const result = await updateSiteSettings(settings)

        if (!result.success) {
            toast.error("Ayarlar kaydedilemedi: " + result.message)
        } else {
            toast.success("Ayarlar kaydedildi ve site güncellendi!")
            fetchSettings()
        }
        setSaving(false)
    }

    const updateImageUrl = (key: string, url: string) => {
        setSiteImages(prev => prev.map(img =>
            img.key === key ? { ...img, url } : img
        ))
    }

    const saveSiteImages = async () => {
        setSavingImages(true)

        try {
            // Upsert each image
            for (const img of siteImages) {
                if (img.url) {
                    await supabase
                        .from("site_images")
                        .upsert({
                            key: img.key,
                            url: img.url,
                            alt_text: img.alt_text
                        }, { onConflict: 'key' })
                }
            }

            toast.success("Görseller kaydedildi!")
        } catch (error) {
            toast.error("Görseller kaydedilemedi")
        } finally {
            setSavingImages(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dosya boyutu en fazla 5MB olabilir')
            return
        }

        setUploadingKey(key)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('key', key)

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                updateImageUrl(key, data.url)
                toast.success('Görsel yüklendi!')
            } else {
                toast.error(data.error || 'Yükleme başarısız')
            }
        } catch (error) {
            toast.error('Yükleme sırasında hata oluştu')
        } finally {
            setUploadingKey(null)
        }
    }

    if (loading) {
        return <div className="text-slate-400">Yükleniyor...</div>
    }

    return (
        <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-emerald-400 mt-0.5" />
                <div>
                    <p className="text-emerald-400 font-medium">Dinamik Ayarlar</p>
                    <p className="text-slate-400 text-sm">
                        Bu ayarları değiştirdiğinizde sitedeki ilgili bilgiler otomatik olarak güncellenir.
                    </p>
                </div>
            </div>

            {/* Arka Plan Görselleri */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Image className="h-5 w-5 text-emerald-400" />
                        Arka Plan Görselleri
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Sitenin farklı bölümlerinde kullanılan görselleri URL ile veya bilgisayarınızdan yükleyebilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {siteImages.map((img) => (
                        <div key={img.key} className="space-y-3 p-4 bg-slate-800/50 rounded-xl border border-white/5">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                {img.key.includes('video') ? (
                                    <Video className="h-4 w-4 text-blue-400" />
                                ) : (
                                    <Image className="h-4 w-4 text-purple-400" />
                                )}
                                {img.label}
                            </label>

                            {/* URL Input */}
                            <div className="flex gap-2">
                                <Input
                                    value={img.url}
                                    onChange={(e) => updateImageUrl(img.key, e.target.value)}
                                    placeholder="https://... görsel veya video URL'si"
                                    className="bg-slate-900 border-white/10 text-white flex-1"
                                />
                                {img.url && (
                                    <a
                                        href={img.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-slate-900 border border-white/10 rounded-md hover:bg-slate-700 transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4 text-slate-400" />
                                    </a>
                                )}
                            </div>

                            {/* File Upload */}
                            {!img.key.includes('video') && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500">veya</span>
                                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                                        <Upload className="h-4 w-4 text-emerald-400" />
                                        <span className="text-sm text-white">Dosya Yükle</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, img.key)}
                                        />
                                    </label>
                                    {uploadingKey === img.key && (
                                        <span className="text-xs text-emerald-400">Yükleniyor...</span>
                                    )}
                                </div>
                            )}

                            {/* Preview */}
                            {img.url && img.key.includes('image') && (
                                <div className="w-40 h-24 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                                    <img
                                        src={img.url}
                                        alt={img.alt_text}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <Button
                        onClick={saveSiteImages}
                        disabled={savingImages}
                        className="w-full bg-emerald-500 hover:bg-emerald-600"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {savingImages ? "Kaydediliyor..." : "Görselleri Kaydet"}
                    </Button>

                    <p className="text-xs text-slate-500">
                        💡 İpucu: Görsel boyutu en fazla 5MB olmalıdır. Video için harici URL kullanın.
                    </p>
                </CardContent>
            </Card>

            {/* Etkinlik Bilgileri */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">Etkinlik Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">Etkinlik Tarihi</label>
                        <Input
                            type="date"
                            value={settings.event_date}
                            onChange={(e) => setSettings({ ...settings, event_date: e.target.value })}
                            className="bg-slate-800 border-white/10 text-white max-w-xs"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Fiyatlandırma */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">Fiyatlandırma</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">Kısa Parkur Ücreti (TL)</label>
                        <Input
                            type="number"
                            value={settings.short_price}
                            onChange={(e) => setSettings({ ...settings, short_price: Number(e.target.value) })}
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">Uzun Parkur Ücreti (TL)</label>
                        <Input
                            type="number"
                            value={settings.long_price}
                            onChange={(e) => setSettings({ ...settings, long_price: Number(e.target.value) })}
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Ödeme Bilgileri */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">Ödeme Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">Banka Adı</label>
                        <Input
                            value={settings.bank_name}
                            onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">Hesap Sahibi</label>
                        <Input
                            value={settings.account_holder}
                            onChange={(e) => setSettings({ ...settings, account_holder: e.target.value })}
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">IBAN</label>
                        <Input
                            value={settings.iban}
                            onChange={(e) => setSettings({ ...settings, iban: e.target.value })}
                            className="bg-slate-800 border-white/10 text-white font-mono"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* İletişim */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">İletişim Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">E-posta</label>
                        <Input
                            type="email"
                            value={settings.contact_email}
                            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-2">Telefon</label>
                        <Input
                            value={settings.contact_phone}
                            onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Kaydet Butonu */}
            <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-600"
            >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
        </div>
    )
}

