"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Plus, Trash2, Edit2, Loader2, Save, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addTestimonial, updateTestimonial, deleteTestimonial } from "@/app/content-actions"

interface Testimonial {
    id: string
    name: string
    location: string
    comment: string
    rating: number
    avatar_url?: string
}

interface Props {
    items: Testimonial[]
}

export function TestimonialsManager({ items }: Props) {
    const [newName, setNewName] = useState("")
    const [newLocation, setNewLocation] = useState("")
    const [newComment, setNewComment] = useState("")
    const [newRating, setNewRating] = useState(5)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [editLocation, setEditLocation] = useState("")
    const [editComment, setEditComment] = useState("")
    const [editRating, setEditRating] = useState(5)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAdd = async () => {
        if (!newName.trim() || !newComment.trim()) return
        setLoading(true)
        await addTestimonial({
            name: newName,
            location: newLocation,
            comment: newComment,
            rating: newRating
        })
        setNewName("")
        setNewLocation("")
        setNewComment("")
        setNewRating(5)
        setLoading(false)
        router.refresh()
    }

    const startEdit = (item: Testimonial) => {
        setEditingId(item.id)
        setEditName(item.name)
        setEditLocation(item.location)
        setEditComment(item.comment)
        setEditRating(item.rating)
    }

    const handleUpdate = async () => {
        if (!editingId || !editName.trim() || !editComment.trim()) return
        setLoading(true)
        await updateTestimonial(editingId, {
            name: editName,
            location: editLocation,
            comment: editComment,
            rating: editRating
        })
        setEditingId(null)
        setLoading(false)
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return
        await deleteTestimonial(id)
        router.refresh()
    }

    const StarRating = ({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} ${onRate ? 'cursor-pointer' : ''}`}
                    onClick={() => onRate?.(star)}
                />
            ))}
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Add New */}
            <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="h-5 w-5 text-emerald-400" />
                        Yeni Yorum Ekle
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">İsim *</label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ahmet Yılmaz"
                                className="bg-slate-800 border-white/10 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Şehir</label>
                            <Input
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                placeholder="İstanbul"
                                className="bg-slate-800 border-white/10 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Yorum *</label>
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Katılımcı yorumu..."
                            className="bg-slate-800 border-white/10 text-white min-h-[80px]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Değerlendirme</label>
                        <StarRating rating={newRating} onRate={setNewRating} />
                    </div>
                    <Button
                        onClick={handleAdd}
                        disabled={loading || !newName.trim() || !newComment.trim()}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Ekle
                    </Button>
                </CardContent>
            </Card>

            {/* Testimonials List */}
            <div className="grid md:grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="bg-slate-900/50 border-white/10 h-full">
                            <CardContent className="p-4">
                                {editingId === item.id ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                placeholder="İsim"
                                                className="bg-slate-800 border-white/10 text-white"
                                            />
                                            <Input
                                                value={editLocation}
                                                onChange={(e) => setEditLocation(e.target.value)}
                                                placeholder="Şehir"
                                                className="bg-slate-800 border-white/10 text-white"
                                            />
                                        </div>
                                        <Textarea
                                            value={editComment}
                                            onChange={(e) => setEditComment(e.target.value)}
                                            className="bg-slate-800 border-white/10 text-white min-h-[60px]"
                                        />
                                        <StarRating rating={editRating} onRate={setEditRating} />
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleUpdate} disabled={loading}>
                                                <Save className="h-4 w-4 mr-1" /> Kaydet
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                <X className="h-4 w-4 mr-1" /> İptal
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-medium text-white">{item.name}</h4>
                                                <p className="text-sm text-slate-500">{item.location}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(item)}>
                                                    <Edit2 className="h-4 w-4 text-slate-400" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </div>
                                        <StarRating rating={item.rating} />
                                        <p className="text-slate-400 text-sm mt-2">{item.comment}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz yorum eklenmemiş</p>
                </div>
            )}
        </div>
    )
}
