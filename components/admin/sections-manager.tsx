"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Layout, Eye, EyeOff, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { updateSectionVisibility } from "@/app/content-actions"

interface Props {
    settings: Record<string, boolean>
}

const SECTIONS = [
    { key: 'hero', name: 'Hero Bölümü', description: 'Ana sayfa üst bölüm (video/resim)', icon: '🎬' },
    { key: 'sponsors', name: 'Sponsorlar', description: 'Sponsor logoları bölümü', icon: '🏢' },
    { key: 'gallery', name: 'Galeri', description: 'Fotoğraf galerisi bölümü', icon: '🖼️' },
    { key: 'faq', name: 'SSS', description: 'Sıkça sorulan sorular', icon: '❓' },
    { key: 'testimonials', name: 'Yorumlar', description: 'Katılımcı yorumları', icon: '💬' },
    { key: 'news', name: 'Haberler', description: 'Blog/haberler bölümü', icon: '📰' },
    { key: 'social', name: 'Sosyal Medya', description: 'Sosyal medya feed', icon: '📱' },
    { key: 'counter', name: 'Sporcu Sayacı', description: 'Kayıtlı sporcu sayısı', icon: '👥' },
]

export function SectionsManager({ settings }: Props) {
    const [loading, setLoading] = useState<string | null>(null)
    const router = useRouter()

    const handleToggle = async (sectionKey: string, currentValue: boolean) => {
        setLoading(sectionKey)
        await updateSectionVisibility(sectionKey, !currentValue)
        setLoading(null)
        router.refresh()
    }

    const getSectionValue = (key: string) => {
        // Default to true if not set
        return settings[key] !== false
    }

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                {SECTIONS.map((section, index) => {
                    const isVisible = getSectionValue(section.key)
                    const isLoading = loading === section.key

                    return (
                        <motion.div
                            key={section.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className={`bg-slate-900/50 border-white/10 ${!isVisible ? 'opacity-60' : ''}`}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl">{section.icon}</div>
                                        <div>
                                            <h4 className="font-medium text-white flex items-center gap-2">
                                                {section.name}
                                                {isVisible ? (
                                                    <Eye className="h-4 w-4 text-emerald-400" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-slate-500" />
                                                )}
                                            </h4>
                                            <p className="text-sm text-slate-500">{section.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                                        <Switch
                                            checked={isVisible}
                                            onCheckedChange={() => handleToggle(section.key, isVisible)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            <Card className="bg-blue-500/10 border-blue-500/20">
                <CardContent className="p-4">
                    <p className="text-blue-400 text-sm">
                        💡 <strong>İpucu:</strong> Bölümleri gizlediğinizde ana sayfada görünmezler,
                        ancak içerikleri silinmez. İstediğiniz zaman tekrar açabilirsiniz.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
