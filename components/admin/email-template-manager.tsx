"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Save, Eye, Code, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEmailTemplates, updateEmailTemplate, type EmailTemplate } from "@/app/content-actions-email"
import { toast } from "sonner"

export function EmailTemplateManager() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([])
    const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null)
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        setLoading(true)
        const result = await getEmailTemplates()

        if (result.success && result.data.length > 0) {
            setTemplates(result.data)
            setActiveTemplate(result.data[0])
        } else {
            toast.error('Şablonlar yüklenemedi')
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!activeTemplate) return

        setSaving(true)
        const result = await updateEmailTemplate(activeTemplate.template_key, {
            subject: activeTemplate.subject,
            html_body: activeTemplate.html_body
        })

        if (result.success) {
            toast.success('Şablon kaydedildi!')
            fetchTemplates()
        } else {
            toast.error('Kaydetme başarısız: ' + result.error)
        }
        setSaving(false)
    }

    const updateTemplate = (field: 'subject' | 'html_body', value: string) => {
        if (!activeTemplate) return

        const updated = { ...activeTemplate, [field]: value }
        setActiveTemplate(updated)
        setTemplates(templates.map(t => t.id === updated.id ? updated : t))
    }

    const renderPreview = () => {
        if (!activeTemplate) return ''

        let html = activeTemplate.html_body
        // Replace variables with sample data
        html = html.replace(/\{\{fullName\}\}/g, 'Ahmet Yılmaz')
        html = html.replace(/\{\{category\}\}/g, 'Uzun Parkur (98 KM)')
        html = html.replace(/\{\{email\}\}/g, 'ahmet@example.com')
        html = html.replace(/\{\{reason\}\}/g, 'Eksik belge')
        html = html.replace(/\{\{name\}\}/g, 'Mehmet Demir')
        html = html.replace(/\{\{originalMessage\}\}/g, 'Etkinlik hakkında bilgi almak istiyorum.')
        html = html.replace(/\{\{reply\}\}/g, 'Merhaba! Etkinlik 12 Eylül 2026 tarihinde gerçekleşecektir.')
        html = html.replace(/\{\{adminName\}\}/g, 'Admin')
        html = html.replace(/\{\{eventDate\}\}/g, '12 Eylül 2026')
        return html
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    if (!activeTemplate) {
        return (
            <div className="text-center py-12 text-slate-400">
                Şablon bulunamadı. Lütfen database migration script'ini çalıştırın.
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Mail className="h-8 w-8 text-emerald-400" />
                        Email Şablonları
                    </h1>
                    <p className="text-slate-400 mt-1">Sistem e-postalarını özelleştirin</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-600"
                >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Template List */}
                <div className="space-y-2">
                    {templates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => setActiveTemplate(template)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${activeTemplate.id === template.id
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                                    : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-slate-500 mt-1 truncate">{template.subject}</div>
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div className="lg:col-span-3 space-y-4">
                    <Tabs defaultValue="edit" onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}>
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-slate-800">
                                <TabsTrigger value="edit" className="data-[state=active]:bg-emerald-500">
                                    <Code className="h-4 w-4 mr-2" /> Düzenle
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="data-[state=active]:bg-emerald-500">
                                    <Eye className="h-4 w-4 mr-2" /> Önizleme
                                </TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <AlertCircle className="h-3 w-3" />
                                Değişkenler: {activeTemplate.variables.map(v => `{{${v}}}`).join(', ')}
                            </div>
                        </div>

                        <TabsContent value="edit" className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Konu</label>
                                <input
                                    type="text"
                                    value={activeTemplate.subject}
                                    onChange={(e) => updateTemplate('subject', e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">İçerik (HTML)</label>
                                <textarea
                                    value={activeTemplate.html_body}
                                    onChange={(e) => updateTemplate('html_body', e.target.value)}
                                    rows={20}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none resize-none"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="preview">
                            <div className="bg-slate-800 border border-white/10 rounded-xl p-6 overflow-auto max-h-[600px]">
                                <div dangerouslySetInnerHTML={{ __html: renderPreview() }} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </motion.div>
    )
}
