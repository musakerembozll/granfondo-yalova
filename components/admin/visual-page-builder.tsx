"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { 
    Eye, EyeOff, GripVertical, Settings, Save, Loader2, 
    Monitor, Smartphone, Tablet, RefreshCw, ExternalLink,
    ChevronDown, ChevronUp, Image as ImageIcon, Type, 
    Layout, Palette, X, Check, Edit3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

// Section definitions with editable fields
const SECTION_DEFINITIONS = {
    hero: {
        name: 'Hero Bölümü',
        icon: '🎬',
        description: 'Ana sayfa üst bölüm',
        fields: [
            { key: 'title', label: 'Başlık', type: 'text' },
            { key: 'subtitle', label: 'Alt Başlık', type: 'textarea' },
            { key: 'buttonText', label: 'Buton Metni', type: 'text' },
            { key: 'backgroundUrl', label: 'Arka Plan Görsel URL', type: 'image' },
        ]
    },
    counter: {
        name: 'Sporcu Sayacı',
        icon: '👥',
        description: 'Kayıtlı sporcu sayısı',
        fields: [
            { key: 'label', label: 'Etiket', type: 'text' },
        ]
    },
    sponsors: {
        name: 'Sponsorlar',
        icon: '🏢',
        description: 'Sponsor logoları bölümü',
        fields: [
            { key: 'title', label: 'Bölüm Başlığı', type: 'text' },
        ]
    },
    gallery: {
        name: 'Galeri',
        icon: '🖼️',
        description: 'Fotoğraf galerisi bölümü',
        fields: [
            { key: 'title', label: 'Bölüm Başlığı', type: 'text' },
            { key: 'subtitle', label: 'Alt Başlık', type: 'text' },
        ]
    },
    faq: {
        name: 'SSS',
        icon: '❓',
        description: 'Sıkça sorulan sorular',
        fields: [
            { key: 'title', label: 'Bölüm Başlığı', type: 'text' },
        ]
    },
    testimonials: {
        name: 'Yorumlar',
        icon: '💬',
        description: 'Katılımcı yorumları',
        fields: [
            { key: 'title', label: 'Bölüm Başlığı', type: 'text' },
        ]
    },
    news: {
        name: 'Haberler',
        icon: '📰',
        description: 'Blog/haberler bölümü',
        fields: [
            { key: 'title', label: 'Bölüm Başlığı', type: 'text' },
        ]
    },
    social: {
        name: 'Sosyal Medya',
        icon: '📱',
        description: 'Sosyal medya feed',
        fields: [
            { key: 'title', label: 'Bölüm Başlığı', type: 'text' },
        ]
    },
}

type SectionKey = keyof typeof SECTION_DEFINITIONS

interface Section {
    id: string
    key: SectionKey
    visible: boolean
    order: number
    content: Record<string, string>
}

interface Props {
    initialSettings: Record<string, boolean>
    initialOrder: string[]
    initialContent: Record<string, Record<string, string>>
}

export function VisualPageBuilder({ initialSettings, initialOrder, initialContent }: Props) {
    const [sections, setSections] = useState<Section[]>([])
    const [saving, setSaving] = useState(false)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [hasChanges, setHasChanges] = useState(false)

    // Initialize sections from props
    useEffect(() => {
        const defaultOrder = Object.keys(SECTION_DEFINITIONS) as SectionKey[]
        const orderedKeys = initialOrder.length > 0 
            ? [...initialOrder, ...defaultOrder.filter(k => !initialOrder.includes(k))]
            : defaultOrder

        const initialSections: Section[] = orderedKeys.map((key, index) => ({
            id: key,
            key: key as SectionKey,
            visible: initialSettings[key] !== false,
            order: index,
            content: initialContent[key] || {}
        }))

        setSections(initialSections)
    }, [initialSettings, initialOrder, initialContent])

    const handleReorder = (reorderedSections: Section[]) => {
        setSections(reorderedSections.map((s, i) => ({ ...s, order: i })))
        setHasChanges(true)
    }

    const toggleVisibility = (sectionId: string) => {
        setSections(prev => 
            prev.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s)
        )
        setHasChanges(true)
    }

    const updateContent = (sectionId: string, field: string, value: string) => {
        setSections(prev =>
            prev.map(s => 
                s.id === sectionId 
                    ? { ...s, content: { ...s.content, [field]: value } }
                    : s
            )
        )
        setHasChanges(true)
    }

    const saveAllChanges = async () => {
        setSaving(true)

        try {
            // Save section visibility and order
            const visibilitySettings: Record<string, boolean> = {}
            const orderArray: string[] = []

            sections.forEach(s => {
                visibilitySettings[s.key] = s.visible
                orderArray.push(s.key)
            })

            // Update section settings
            const { error: settingsError } = await supabase
                .from('section_settings')
                .upsert({ 
                    id: 'main',
                    settings: visibilitySettings,
                    section_order: orderArray
                })

            if (settingsError) throw settingsError

            // Save hero content separately
            const heroSection = sections.find(s => s.key === 'hero')
            if (heroSection && Object.keys(heroSection.content).length > 0) {
                const { data: existingHero } = await supabase
                    .from('hero_content')
                    .select('id')
                    .single()

                if (existingHero) {
                    await supabase
                        .from('hero_content')
                        .update({
                            title: heroSection.content.title,
                            subtitle: heroSection.content.subtitle,
                            button_text: heroSection.content.buttonText,
                            background_url: heroSection.content.backgroundUrl
                        })
                        .eq('id', existingHero.id)
                } else {
                    await supabase
                        .from('hero_content')
                        .insert({
                            title: heroSection.content.title,
                            subtitle: heroSection.content.subtitle,
                            button_text: heroSection.content.buttonText,
                            background_url: heroSection.content.backgroundUrl
                        })
                }
            }

            toast.success('Tüm değişiklikler kaydedildi!')
            setHasChanges(false)
        } catch (error) {
            console.error('Save error:', error)
            toast.error('Kaydetme sırasında hata oluştu')
        }

        setSaving(false)
    }

    const previewWidth = {
        desktop: 'w-full',
        tablet: 'w-[768px]',
        mobile: 'w-[375px]'
    }

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Layout className="h-5 w-5 text-emerald-400" />
                        Sayfa Düzenleyici
                    </h2>
                    <div className="h-6 w-px bg-slate-700" />
                    <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1">
                        <button 
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('tablet')}
                            className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Tablet className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <span className="text-amber-400 text-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            Kaydedilmemiş değişiklikler
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/', '_blank')}
                        className="border-white/20 text-slate-300"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Önizle
                    </Button>
                    <Button
                        onClick={saveAllChanges}
                        disabled={saving || !hasChanges}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Kaydet
                    </Button>
                </div>
            </div>

            {/* Main Content - Two Columns */}
            <div className="flex gap-6 flex-1 min-h-0">
                {/* Sections List - Left Panel */}
                <div className="w-[400px] flex-shrink-0 overflow-y-auto">
                    <Card className="bg-slate-900/50 border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-white text-sm flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-slate-500" />
                                Bölümler (Sürükle & Bırak)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <Reorder.Group 
                                axis="y" 
                                values={sections} 
                                onReorder={handleReorder}
                                className="space-y-2"
                            >
                                {sections.map((section) => {
                                    const def = SECTION_DEFINITIONS[section.key]
                                    const isEditing = editingSection === section.id

                                    return (
                                        <Reorder.Item
                                            key={section.id}
                                            value={section}
                                            className="cursor-grab active:cursor-grabbing"
                                        >
                                            <motion.div
                                                layout
                                                className={`rounded-xl border transition-all ${
                                                    section.visible 
                                                        ? 'bg-slate-800/80 border-white/10' 
                                                        : 'bg-slate-900/50 border-white/5 opacity-60'
                                                } ${isEditing ? 'ring-2 ring-emerald-500' : ''}`}
                                            >
                                                {/* Section Header */}
                                                <div className="flex items-center gap-3 p-3">
                                                    <GripVertical className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                                    <span className="text-2xl">{def.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-white text-sm truncate">
                                                            {def.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {def.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditingSection(isEditing ? null : section.id)}
                                                            className={`p-1.5 rounded-lg transition-colors ${
                                                                isEditing 
                                                                    ? 'bg-emerald-500 text-white' 
                                                                    : 'hover:bg-white/10 text-slate-400'
                                                            }`}
                                                        >
                                                            {isEditing ? <ChevronUp className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                                                        </button>
                                                        <Switch
                                                            checked={section.visible}
                                                            onCheckedChange={() => toggleVisibility(section.id)}
                                                            className="scale-75"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Expanded Editor */}
                                                <AnimatePresence>
                                                    {isEditing && def.fields.length > 0 && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-3 pt-0 space-y-3 border-t border-white/5">
                                                                {def.fields.map(field => (
                                                                    <div key={field.key}>
                                                                        <label className="text-xs text-slate-400 block mb-1">
                                                                            {field.label}
                                                                        </label>
                                                                        {field.type === 'textarea' ? (
                                                                            <Textarea
                                                                                value={section.content[field.key] || ''}
                                                                                onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                                                                                className="bg-slate-900/80 border-white/10 text-white text-sm min-h-[60px]"
                                                                                placeholder={`${field.label} girin...`}
                                                                            />
                                                                        ) : (
                                                                            <Input
                                                                                value={section.content[field.key] || ''}
                                                                                onChange={(e) => updateContent(section.id, field.key, e.target.value)}
                                                                                className="bg-slate-900/80 border-white/10 text-white text-sm"
                                                                                placeholder={`${field.label} girin...`}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </Reorder.Item>
                                    )
                                })}
                            </Reorder.Group>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Panel - Right Panel */}
                <div className="flex-1 min-w-0 overflow-hidden">
                    <Card className="bg-slate-900/50 border-white/10 h-full flex flex-col">
                        <CardHeader className="pb-3 flex-shrink-0">
                            <CardTitle className="text-white text-sm flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-emerald-400" />
                                    Canlı Önizleme
                                </span>
                                <span className="text-xs text-slate-500">
                                    {previewMode === 'desktop' && '1920px'}
                                    {previewMode === 'tablet' && '768px'}
                                    {previewMode === 'mobile' && '375px'}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 pt-0 overflow-auto">
                            <div className={`mx-auto ${previewWidth[previewMode]} transition-all duration-300`}>
                                <div className="bg-slate-950 rounded-lg border border-white/10 overflow-hidden min-h-[600px]">
                                    {/* Preview representation of sections */}
                                    {sections.filter(s => s.visible).map((section, index) => {
                                        const def = SECTION_DEFINITIONS[section.key]
                                        return (
                                            <motion.div
                                                key={section.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={`border-b border-white/5 last:border-b-0 ${
                                                    editingSection === section.id ? 'ring-2 ring-emerald-500 ring-inset' : ''
                                                }`}
                                            >
                                                <div 
                                                    className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                                                    onClick={() => setEditingSection(section.id)}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-xl">{def.icon}</span>
                                                        <span className="text-sm font-medium text-white">{def.name}</span>
                                                    </div>
                                                    {section.key === 'hero' && (
                                                        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg p-4 mt-2">
                                                            <h3 className="text-lg font-bold text-white">
                                                                {section.content.title || 'Hero Başlığı'}
                                                            </h3>
                                                            <p className="text-sm text-slate-400 mt-1">
                                                                {section.content.subtitle || 'Alt başlık metni...'}
                                                            </p>
                                                            <div className="mt-3">
                                                                <span className="px-4 py-2 bg-emerald-500 text-white text-xs rounded-lg">
                                                                    {section.content.buttonText || 'Buton'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {section.key !== 'hero' && (
                                                        <div className="bg-slate-800/50 rounded-lg p-3 mt-2">
                                                            <div className="flex gap-2">
                                                                {[1, 2, 3].map(i => (
                                                                    <div 
                                                                        key={i} 
                                                                        className="flex-1 aspect-video bg-slate-700/50 rounded"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
