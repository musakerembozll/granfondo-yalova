"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addNewsComment } from "@/app/content-actions"

interface Comment {
    id: string
    author_name: string
    content: string
    created_at: string
}

interface Props {
    newsId: string
    initialComments: Comment[]
}

export function NewsComments({ newsId, initialComments }: Props) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const [formData, setFormData] = useState({
        author_name: "",
        author_email: "",
        content: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await addNewsComment(newsId, formData)

        if (result.success) {
            setSubmitted(true)
            setFormData({ author_name: "", author_email: "", content: "" })
            
            // Reset submitted message after 3 seconds
            setTimeout(() => setSubmitted(false), 3000)
        } else {
            setError(result.message || "Yorum gönderilirken bir hata oluştu")
        }

        setLoading(false)
    }

    return (
        <section className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                    <MessageCircle className="h-8 w-8 text-emerald-400" />
                    Yorumlar
                </h2>
                <p className="text-slate-400">
                    {comments.length} yorum
                </p>
            </div>

            {/* Comments List */}
            {comments.length > 0 && (
                <div className="space-y-4">
                    <AnimatePresence>
                        {comments.map((comment, index) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-900/50 border border-white/10 rounded-xl p-5"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-white">{comment.author_name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {comments.length === 0 && !submitted && (
                <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">Henüz yorum bulunmuyor. İlk yorumu siz yapın!</p>
                </div>
            )}

            {/* Comment Form */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Bir Yorum Yazın</h3>

                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3"
                    >
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-emerald-400">Yorumunuz gönderildi!</p>
                            <p className="text-sm text-emerald-300">
                                Yönetici tarafından incelendikten sonra yayınlanacaktır.
                            </p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
                    >
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Ad Soyad *</label>
                            <Input
                                type="text"
                                placeholder="Adınız"
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                className="bg-slate-950 border-slate-800 text-white"
                                required
                                disabled={loading || submitted}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">E-posta *</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={formData.author_email}
                                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                                className="bg-slate-950 border-slate-800 text-white"
                                required
                                disabled={loading || submitted}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Yorum *</label>
                        <Textarea
                            placeholder="Düşüncelerinizi paylaşın..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="bg-slate-950 border-slate-800 text-white min-h-[120px]"
                            required
                            disabled={loading || submitted}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500">
                            💡 Yazılı kurallar: İçeriği incelendikten sonra yayınlanacaktır.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || submitted}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Gönderiliyor...
                            </>
                        ) : submitted ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Gönderildi
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Yorumu Gönder
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Policy Notice */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                    <strong>Moderasyon:</strong> Uygunsuz içerik barındıran yorumlar yayınlanmayacaktır. 
                    Tüm yorumlar yöneticiler tarafından incelenir.
                </p>
            </div>
        </section>
    )
}
