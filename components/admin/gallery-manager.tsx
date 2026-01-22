"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Image, Plus, Trash2, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addGalleryItem, deleteGalleryItem } from "@/app/content-actions"
import { toast } from "sonner"

interface GalleryItem {
    id: string
    url: string
    caption: string
    order_index: number
}

interface Props {
    items: GalleryItem[]
}

export function GalleryManager({ items }: Props) {
    const [newUrl, setNewUrl] = useState("")
    const [newCaption, setNewCaption] = useState("")
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dosya boyutu en fazla 5MB olabilir')
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('key', `gallery_${Date.now()}`)

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setNewUrl(data.url)
                toast.success('Görsel yüklendi! Şimdi "Ekle" butonuna basın.')
            } else {
                toast.error(data.error || 'Yükleme başarısız')
            }
        } catch (error) {
            toast.error('Yükleme sırasında hata oluştu')
        } finally {
            setUploading(false)
        }
    }

    const handleAdd = async () => {
        if (!newUrl.trim()) return
        setLoading(true)
        await addGalleryItem({ url: newUrl, caption: newCaption })
        setNewUrl("")
        setNewCaption("")
        setLoading(false)
        router.refresh()
        toast.success('Fotoğraf eklendi!')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) return
        await deleteGalleryItem(id)
        router.refresh()
        toast.success('Fotoğraf silindi')
    }

    return (
        <div className="space-y-6">
            {/* Add New */}
            <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="h-5 w-5 text-emerald-400" />
                        Yeni Fotoğraf Ekle
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-dashed border-white/20">
                        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {uploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                        {uploading && <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />}
                        <span className="text-sm text-slate-500">veya URL girin</span>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Fotoğraf URL</label>
                        <Input
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Açıklama</label>
                        <Input
                            value={newCaption}
                            onChange={(e) => setNewCaption(e.target.value)}
                            placeholder="Fotoğraf açıklaması"
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>

                    {/* Preview */}
                    {newUrl && (
                        <div className="w-32 h-24 rounded-lg overflow-hidden bg-slate-800 border border-white/10">
                            <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <Button
                        onClick={handleAdd}
                        disabled={loading || !newUrl.trim()}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Ekle
                    </Button>
                </CardContent>
            </Card>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden"
                    >
                        <img
                            src={item.url}
                            alt={item.caption}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        {item.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                <p className="text-sm text-white truncate">{item.caption}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz fotoğraf eklenmemiş</p>
                </div>
            )}
        </div>
    )
}
