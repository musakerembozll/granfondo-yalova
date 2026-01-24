"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RefreshCw, Image as ImageIcon, Settings, Info } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { updateSiteSettings, SiteSettings } from "@/app/content-actions"
import { UnifiedMediaManager } from "@/components/admin/unified-media-manager"

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
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
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

    if (loading) {
        return <div className="text-slate-400">Yükleniyor...</div>
    }

    return (
        <Tabs defaultValue="media" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="media" className="data-[state=active]:bg-emerald-500">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Medya Yönetimi
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500">
                    <Settings className="h-4 w-4 mr-2" />
                    Site Ayarları
                </TabsTrigger>
            </TabsList>

            <TabsContent value="media" className="mt-6">
                <UnifiedMediaManager />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
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

            {/* Bilgilendirme */}
            <Card className="bg-blue-500/10 border-blue-500/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-blue-300 font-medium mb-1">Fiyatlandırma Artık Etkinliklerde!</p>
                            <p className="text-blue-400 text-sm">
                                Fiyatlandırma ayarları artık <strong>Etkinlikler</strong> bölümünden yönetiliyor. 
                                Her etkinlik için ayrı fiyat belirleyebilirsiniz.
                            </p>
                        </div>
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
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
            </TabsContent>
        </Tabs>
    )
}

