"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { HelpCircle, Plus, Trash2, Edit2, Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addFaqItem, updateFaqItem, deleteFaqItem } from "@/app/content-actions"

interface FaqItem {
    id: string
    question: string
    answer: string
    order_index: number
}

interface Props {
    items: FaqItem[]
}

export function FaqManager({ items }: Props) {
    const [newQuestion, setNewQuestion] = useState("")
    const [newAnswer, setNewAnswer] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editQuestion, setEditQuestion] = useState("")
    const [editAnswer, setEditAnswer] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAdd = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) return
        setLoading(true)
        await addFaqItem({ question: newQuestion, answer: newAnswer })
        setNewQuestion("")
        setNewAnswer("")
        setLoading(false)
        router.refresh()
    }

    const startEdit = (item: FaqItem) => {
        setEditingId(item.id)
        setEditQuestion(item.question)
        setEditAnswer(item.answer)
    }

    const handleUpdate = async () => {
        if (!editingId || !editQuestion.trim() || !editAnswer.trim()) return
        setLoading(true)
        await updateFaqItem(editingId, { question: editQuestion, answer: editAnswer })
        setEditingId(null)
        setLoading(false)
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return
        await deleteFaqItem(id)
        router.refresh()
    }

    return (
        <div className="space-y-6">
            {/* Add New */}
            <Card className="bg-slate-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="h-5 w-5 text-emerald-400" />
                        Yeni Soru Ekle
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Soru *</label>
                        <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Sıkça sorulan soru..."
                            className="bg-slate-800 border-white/10 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Cevap *</label>
                        <Textarea
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Sorunun cevabı..."
                            className="bg-slate-800 border-white/10 text-white min-h-[100px]"
                        />
                    </div>
                    <Button
                        onClick={handleAdd}
                        disabled={loading || !newQuestion.trim() || !newAnswer.trim()}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Ekle
                    </Button>
                </CardContent>
            </Card>

            {/* FAQ List */}
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
                                {editingId === item.id ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={editQuestion}
                                            onChange={(e) => setEditQuestion(e.target.value)}
                                            className="bg-slate-800 border-white/10 text-white"
                                        />
                                        <Textarea
                                            value={editAnswer}
                                            onChange={(e) => setEditAnswer(e.target.value)}
                                            className="bg-slate-800 border-white/10 text-white min-h-[80px]"
                                        />
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
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                                                <HelpCircle className="h-4 w-4 text-emerald-400" />
                                                {item.question}
                                            </h4>
                                            <p className="text-slate-400 text-sm">{item.answer}</p>
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
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz soru eklenmemiş</p>
                </div>
            )}
        </div>
    )
}
