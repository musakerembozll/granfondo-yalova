"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Newspaper, Plus, Trash2, Edit2, Loader2, Save, X, Eye, EyeOff, Calendar, Image, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { addNews, updateNews, deleteNews } from "@/app/content-actions"

interface NewsItem {
    id: string
    title: string
    excerpt: string
    content: string
    image_url: string
    category: string
    read_time?: string
    is_published: boolean
    published_at?: string
    created_at: string
}

interface Props {
    items: NewsItem[]
}

const CATEGORIES = ['Duyuru', 'Parkur', 'Antrenman', 'Etkinlik', 'Sponsorluk', 'Genel']

export function NewsManager({ items }: Props) {
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: 'Duyuru',
        read_time: '3 dk',
        is_published: false
    })
    const router = useRouter()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        setUploading(true)
        try {
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)
            formDataUpload.append('key', `news_${Date.now()}`)
            
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formDataUpload
            })
            
            const result = await response.json()
            
            if (response.ok && result.url) {
                setFormData(prev => ({ ...prev, image_url: result.url }))
            } else {
                alert('Yükleme başarısız: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Yükleme sırasında hata oluştu')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image_url: '',
            category: 'Duyuru',
            read_time: '3 dk',
            is_published: false
        })
        setEditingItem(null)
        setShowForm(false)
    }

    const startEdit = (item: NewsItem) => {
        setEditingItem(item)
        setFormData({
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            image_url: item.image_url,
            category: item.category,
            read_time: item.read_time || '3 dk',
            is_published: item.is_published
        })
        setShowForm(true)
    }

    const handleSubmit = async () => {
        if (!formData.title.trim() || !formData.excerpt.trim()) return
        setLoading(true)

        if (editingItem) {
            await updateNews(editingItem.id, formData)
        } else {
            await addNews(formData)
        }

        resetForm()
        setLoading(false)
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return
        await deleteNews(id)
        router.refresh()
    }

    return (
        <div className="space-y-6">
            {/* Add/Edit Form */}
            {showForm ? (
                <Card className="bg-slate-900/50 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {editingItem ? <Edit2 className="h-5 w-5 text-yellow-400" /> : <Plus className="h-5 w-5 text-emerald-400" />}
                                {editingItem ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
                            </span>
                            <Button variant="ghost" size="icon" onClick={resetForm}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Başlık *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Haber başlığı"
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-800 border border-white/10 text-white rounded-md px-3 py-2"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Okuma Süresi</label>
                                    <Input
                                        value={formData.read_time}
                                        onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                        placeholder="3 dk"
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Görsel</label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg veya dosya yükleyin"
                                        className="bg-slate-800 border-white/10 text-white flex-1"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="bg-slate-800 border-white/10 hover:bg-slate-700 text-white"
                                    >
                                        {uploading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Upload className="h-4 w-4" />
                                        )}
                                        <span className="ml-2">{uploading ? 'Yükleniyor...' : 'Dosya Yükle'}</span>
                                    </Button>
                                </div>
                                {formData.image_url && (
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={formData.image_url} 
                                            alt="Önizleme" 
                                            className="h-16 w-24 object-cover rounded border border-white/10"
                                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                        />
                                        <span className="text-xs text-slate-500 truncate max-w-xs">{formData.image_url}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Özet *</label>
                            <Textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Kısa özet (ana sayfada görünür)"
                                className="bg-slate-800 border-white/10 text-white min-h-[80px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">İçerik</label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Tam haber içeriği..."
                                className="bg-slate-800 border-white/10 text-white min-h-[200px]"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={formData.is_published}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                                />
                                <span className="text-slate-400">
                                    {formData.is_published ? (
                                        <span className="flex items-center gap-1 text-emerald-400"><Eye className="h-4 w-4" /> Yayında</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><EyeOff className="h-4 w-4" /> Taslak</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={resetForm}>İptal</Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.title.trim() || !formData.excerpt.trim()}
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {editingItem ? 'Güncelle' : 'Kaydet'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
                    <Plus className="h-4 w-4 mr-2" /> Yeni Haber Ekle
                </Button>
            )}

            {/* News List */}
            <div className="space-y-3">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="bg-slate-900/50 border-white/10">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {item.image_url && (
                                        <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                                                        {item.category}
                                                    </span>
                                                    {item.is_published ? (
                                                        <span className="flex items-center gap-1 text-emerald-400 text-xs">
                                                            <Eye className="h-3 w-3" /> Yayında
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                                                            <EyeOff className="h-3 w-3" /> Taslak
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-medium text-white">{item.title}</h4>
                                                <p className="text-slate-500 text-sm line-clamp-1">{item.excerpt}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                                    </span>
                                                    {item.read_time && <span>{item.read_time}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => startEdit(item)}>
                                                    <Edit2 className="h-4 w-4 text-slate-400" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {items.length === 0 && !showForm && (
                <div className="text-center py-12 text-slate-500">
                    <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz haber eklenmemiş</p>
                </div>
            )}
        </div>
    )
}
