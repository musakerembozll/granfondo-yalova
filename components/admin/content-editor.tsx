"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Type, Image, Upload, Loader2, Check, RefreshCw, Layout, FileText, Megaphone, BarChart3 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface ContentItem {
    key: string
    label: string
    type: "text" | "textarea" | "number"
    section: string
    value: string
}

interface ImageItem {
    key: string
    label: string
    url: string
}

const contentSections = [
    {
        id: "hero",
        name: "Ana Sayfa (Hero)",
        icon: Layout,
        description: "🏠 Ana sayfanın en üstündeki büyük başlık ve alt yazı",
        items: [
            { key: "hero_title", label: "Başlık", type: "text" as const, defaultValue: "GRAN FONDO YALOVA 2026", hint: "Büyük başlık yazısı" },
            { key: "hero_subtitle", label: "Alt Başlık", type: "textarea" as const, defaultValue: "Marmara'nın incisinde, eşsiz doğa ve zorlu parkurlarda pedallamaya hazır mısın? Sınırlarını zorla, efsaneye ortak ol.", hint: "Başlığın altındaki açıklama metni" },
            { key: "hero_cta", label: "Buton Metni", type: "text" as const, defaultValue: "Hemen Kayıt Ol", hint: "Yeşil butonun üzerindeki yazı" },
        ]
    },
    {
        id: "about",
        name: "Hakkında",
        icon: FileText,
        description: "📖 'Hakkında' bölümündeki yazılar",
        items: [
            { key: "about_title", label: "Başlık", type: "text" as const, defaultValue: "Hakkında", hint: "Bölüm başlığı" },
            { key: "about_subtitle", label: "Alt Başlık", type: "text" as const, defaultValue: "GranFondo Yalova Nedir?", hint: "Alt başlık" },
            { key: "about_description", label: "Açıklama", type: "textarea" as const, defaultValue: "GranFondo Yalova, Türkiye'nin en prestijli bisiklet etkinliklerinden biridir.", hint: "Detaylı açıklama metni" },
        ]
    },
    {
        id: "features",
        name: "Özellikler",
        icon: BarChart3,
        description: "✨ Ana sayfadaki 3 özellik kartı",
        items: [
            { key: "feature_1_title", label: "Özellik 1 - Başlık", type: "text" as const, defaultValue: "98 KM Uzun Parkur", hint: "İlk kart başlığı" },
            { key: "feature_1_desc", label: "Özellik 1 - Açıklama", type: "text" as const, defaultValue: "Deneyimli bisikletçiler için zorlu parkur", hint: "İlk kart açıklaması" },
            { key: "feature_2_title", label: "Özellik 2 - Başlık", type: "text" as const, defaultValue: "55 KM Kısa Parkur", hint: "İkinci kart başlığı" },
            { key: "feature_2_desc", label: "Özellik 2 - Açıklama", type: "text" as const, defaultValue: "Her seviyeden bisikletçi için ideal", hint: "İkinci kart açıklaması" },
            { key: "feature_3_title", label: "Özellik 3 - Başlık", type: "text" as const, defaultValue: "Profesyonel Organizasyon", hint: "Üçüncü kart başlığı" },
            { key: "feature_3_desc", label: "Özellik 3 - Açıklama", type: "text" as const, defaultValue: "Güvenli ve profesyonel etkinlik", hint: "Üçüncü kart açıklaması" },
        ]
    },
    {
        id: "cta",
        name: "CTA (Aksiyon)",
        icon: Megaphone,
        description: "📢 Sayfanın altındaki 'Hemen Başvur' bölümü",
        items: [
            { key: "cta_title", label: "Başlık", type: "text" as const, defaultValue: "Yarışa Katılmaya Hazır mısın?", hint: "CTA başlığı" },
            { key: "cta_subtitle", label: "Alt Başlık", type: "text" as const, defaultValue: "Hemen başvur ve bu benzersiz deneyimin parçası ol!", hint: "CTA alt başlığı" },
            { key: "cta_button", label: "Buton Metni", type: "text" as const, defaultValue: "Başvuru Yap", hint: "Buton yazısı" },
        ]
    },
    {
        id: "stats",
        name: "İstatistikler",
        icon: BarChart3,
        description: "📊 Hakkında bölümündeki sayısal veriler",
        items: [
            { key: "stat_1_value", label: "İstatistik 1 - Değer", type: "text" as const, defaultValue: "2000+", hint: "Örn: 2000+" },
            { key: "stat_1_label", label: "İstatistik 1 - Etiket", type: "text" as const, defaultValue: "Katılımcı", hint: "Örn: Katılımcı" },
            { key: "stat_2_value", label: "İstatistik 2 - Değer", type: "text" as const, defaultValue: "15+", hint: "Örn: 15+" },
            { key: "stat_2_label", label: "İstatistik 2 - Etiket", type: "text" as const, defaultValue: "Yıllık Deneyim", hint: "Örn: Yıl" },
            { key: "stat_3_value", label: "İstatistik 3 - Değer", type: "text" as const, defaultValue: "98", hint: "Örn: 98" },
            { key: "stat_3_label", label: "İstatistik 3 - Etiket", type: "text" as const, defaultValue: "Km Parkur", hint: "Örn: Km" },
        ]
    },
]

const imageItems: ImageItem[] = [
    { key: "logo", label: "Site Logosu", url: "" },
    { key: "favicon", label: "Favicon", url: "" },
    { key: "hero_video", label: "Ana Sayfa Video", url: "" },
    { key: "hero_image", label: "Ana Sayfa Görsel (Yedek)", url: "" },
    { key: "og_image", label: "Sosyal Medya Paylaşım Görseli", url: "" },
]

export function ContentEditor() {
    const [content, setContent] = useState<Record<string, string>>({})
    const [images, setImages] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingKey, setUploadingKey] = useState<string | null>(null)
    const [activeSection, setActiveSection] = useState("hero")

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        setLoading(true)
        try {
            // Fetch text content
            const { data: contentData } = await supabase
                .from("site_content")
                .select("*")

            if (contentData) {
                const contentMap: Record<string, string> = {}
                contentData.forEach((item: any) => {
                    contentMap[item.key] = item.content
                })
                setContent(contentMap)
            }

            // Fetch images
            const { data: imageData } = await supabase
                .from("site_images")
                .select("*")

            if (imageData) {
                const imageMap: Record<string, string> = {}
                imageData.forEach((item: any) => {
                    imageMap[item.key] = item.url
                })
                setImages(imageMap)
            }
        } catch (err) {
            console.error("Error fetching content:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleContentChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }))
    }

    const handleImageChange = (key: string, value: string) => {
        setImages(prev => ({ ...prev, [key]: value }))
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0]
        if (!file) return

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
                handleImageChange(key, data.url)
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

    const saveAllContent = async () => {
        setSaving(true)
        try {
            // Save text content
            for (const [key, value] of Object.entries(content)) {
                if (value) {
                    const section = contentSections.find(s => s.items.some(i => i.key === key))?.id || "general"
                    await supabase
                        .from("site_content")
                        .upsert({
                            key,
                            content: value,
                            section,
                            content_type: "text",
                            updated_at: new Date().toISOString()
                        }, { onConflict: "key" })
                }
            }

            // Save images
            for (const [key, url] of Object.entries(images)) {
                if (url) {
                    await supabase
                        .from("site_images")
                        .upsert({
                            key,
                            url,
                            alt_text: key.replace(/_/g, " ")
                        }, { onConflict: "key" })
                }
            }

            toast.success("Tüm içerik kaydedildi!")
        } catch (error) {
            console.error("Save error:", error)
            toast.error("Kaydetme sırasında hata oluştu")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    const currentSection = contentSections.find(s => s.id === activeSection)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">İçerik Yönetimi</h2>
                    <p className="text-slate-400 text-sm">Site üzerindeki tüm yazı ve görselleri buradan düzenleyebilirsiniz.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={fetchContent}
                        className="border-white/10 text-slate-400 hover:text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Yenile
                    </Button>
                    <Button
                        onClick={saveAllContent}
                        disabled={saving}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Tümünü Kaydet
                    </Button>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2">
                {contentSections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === section.id
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                            }`}
                    >
                        <section.icon className="h-4 w-4" />
                        {section.name}
                    </button>
                ))}
                <button
                    onClick={() => setActiveSection("images")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeSection === "images"
                        ? "bg-purple-500 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                        }`}
                >
                    <Image className="h-4 w-4" />
                    Görseller
                </button>
            </div>

            {/* Content Section */}
            {activeSection !== "images" && currentSection && (
                <Card className="bg-slate-900/50 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <currentSection.icon className="h-5 w-5 text-emerald-400" />
                            {currentSection.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {currentSection.description || "Bu bölümdeki yazıları düzenleyin."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentSection.items.map((item: any) => (
                            <div key={item.key} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-slate-400">{item.label}</label>
                                    {item.hint && <span className="text-xs text-slate-500">{item.hint}</span>}
                                </div>
                                {item.type === "textarea" ? (
                                    <Textarea
                                        value={content[item.key] || ""}
                                        onChange={(e) => handleContentChange(item.key, e.target.value)}
                                        placeholder={item.defaultValue || `${item.label} giriniz...`}
                                        className="bg-slate-800 border-white/10 text-white min-h-[100px]"
                                    />
                                ) : (
                                    <Input
                                        value={content[item.key] || ""}
                                        onChange={(e) => handleContentChange(item.key, e.target.value)}
                                        placeholder={item.defaultValue || `${item.label} giriniz...`}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Images Section */}
            {activeSection === "images" && (
                <Card className="bg-slate-900/50 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Image className="h-5 w-5 text-purple-400" />
                            Site Görselleri
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Logo, favicon ve arka plan görsellerini yönetin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {imageItems.map((item) => (
                            <div key={item.key} className="p-4 bg-slate-800/50 rounded-xl border border-white/5 space-y-3">
                                <label className="text-sm font-medium text-white flex items-center gap-2">
                                    <Image className="h-4 w-4 text-purple-400" />
                                    {item.label}
                                </label>

                                {/* URL Input */}
                                <div className="flex gap-2">
                                    <Input
                                        value={images[item.key] || ""}
                                        onChange={(e) => handleImageChange(item.key, e.target.value)}
                                        placeholder="https://... görsel URL'si"
                                        className="bg-slate-900 border-white/10 text-white flex-1"
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500">veya</span>
                                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                                        <Upload className="h-4 w-4 text-emerald-400" />
                                        <span className="text-sm text-white">Dosya Yükle</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, item.key)}
                                        />
                                    </label>
                                    {uploadingKey === item.key && (
                                        <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
                                    )}
                                </div>

                                {/* Preview */}
                                {images[item.key] && !item.key.includes('video') && (
                                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                                        <img
                                            src={images[item.key]}
                                            alt={item.label}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                    💡 <strong>İpucu:</strong> Değişiklikler "Tümünü Kaydet" butonuna bastığınızda uygulanır.
                    Sayfa yenilendiğinde site güncellenmiş içerikleri gösterecektir.
                </p>
            </div>
        </div>
    )
}
