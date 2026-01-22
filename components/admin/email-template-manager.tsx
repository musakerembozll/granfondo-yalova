"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Save, Eye, Code, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
    variables: string[]
}

const defaultTemplates: EmailTemplate[] = [
    {
        id: 'approval',
        name: 'Başvuru Onay',
        subject: 'GranFondo Yalova 2026 - Başvurunuz Onaylandı! 🎉',
        body: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">GranFondo Yalova 2026</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9);">Başvurunuz Onaylandı!</p>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{fullName}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            GranFondo Yalova 2026'ya kayıt başvurunuz başarıyla onaylandı!
            Artık resmi olarak etkinliğimizin bir parçasısınız.
        </p>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #10b981; margin: 0 0 12px;">Kayıt Bilgileriniz</h3>
            <p style="margin: 4px 0;"><strong>Parkur:</strong> {{category}}</p>
            <p style="margin: 4px 0;"><strong>Tarih:</strong> 12 Eylül 2026</p>
            <p style="margin: 4px 0;"><strong>Lokasyon:</strong> Yalova</p>
        </div>
        <p style="line-height: 1.6; color: #94a3b8;">
            Sorularınız için <a href="mailto:info@sporlayalova.com" style="color: #10b981;">info@sporlayalova.com</a> adresine yazabilirsiniz.
        </p>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 24px; text-align: center; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">© 2026 GranFondo Yalova. Tüm hakları saklıdır.</p>
    </div>
</div>`,
        variables: ['fullName', 'category', 'email']
    },
    {
        id: 'rejection',
        name: 'Başvuru Red',
        subject: 'GranFondo Yalova 2026 - Başvurunuz Hakkında',
        body: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #ef4444, #dc2626); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">GranFondo Yalova 2026</h1>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{fullName}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            Maalesef başvurunuz bu aşamada onaylanamamıştır.
        </p>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #ef4444; margin: 0 0 12px;">Red Sebebi</h3>
            <p style="margin: 0;">{{reason}}</p>
        </div>
        <p style="line-height: 1.6; color: #94a3b8;">
            Sorularınız için <a href="mailto:info@sporlayalova.com" style="color: #10b981;">info@sporlayalova.com</a> adresine yazabilirsiniz.
        </p>
    </div>
</div>`,
        variables: ['fullName', 'reason', 'email']
    },
    {
        id: 'newsletter',
        name: 'Bülten',
        subject: 'GranFondo Yalova 2026 - {{subject}}',
        body: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #10b981, #06b6d4); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">GranFondo Yalova 2026</h1>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <h2 style="color: white; margin-bottom: 16px;">{{title}}</h2>
        <div style="line-height: 1.6;">
            {{content}}
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <a href="https://sporlayalova.com" style="display: inline-block; background: linear-gradient(90deg, #10b981, #14b8a6); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold;">
                Siteyi Ziyaret Et
            </a>
        </div>
    </div>
</div>`,
        variables: ['subject', 'title', 'content']
    }
]

export function EmailTemplateManager() {
    const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
    const [activeTemplate, setActiveTemplate] = useState<EmailTemplate>(defaultTemplates[0])
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        // In a real app, this would save to database
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const updateTemplate = (field: keyof EmailTemplate, value: string) => {
        const updated = { ...activeTemplate, [field]: value }
        setActiveTemplate(updated)
        setTemplates(templates.map(t => t.id === updated.id ? updated : t))
    }

    const renderPreview = () => {
        let html = activeTemplate.body
        // Replace variables with sample data
        html = html.replace(/\{\{fullName\}\}/g, 'Ahmet Yılmaz')
        html = html.replace(/\{\{category\}\}/g, 'Uzun Parkur (98 KM)')
        html = html.replace(/\{\{email\}\}/g, 'ahmet@example.com')
        html = html.replace(/\{\{reason\}\}/g, 'Eksik belge')
        html = html.replace(/\{\{subject\}\}/g, 'Yeni Duyuru')
        html = html.replace(/\{\{title\}\}/g, 'Önemli Güncelleme')
        html = html.replace(/\{\{content\}\}/g, '<p>Bu bir örnek içeriktir.</p>')
        return html
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
                    className="bg-emerald-500 hover:bg-emerald-600"
                >
                    {saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {saved ? 'Kaydedildi' : 'Kaydet'}
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
                                    value={activeTemplate.body}
                                    onChange={(e) => updateTemplate('body', e.target.value)}
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
