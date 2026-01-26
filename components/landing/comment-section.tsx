"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Send, User, Mail, Info, ShieldCheck } from "lucide-react"
import { addNewsComment } from "@/app/content-actions"
import { toast } from "sonner"

interface Comment {
    id: string
    full_name: string
    content: string
    created_at: string
}

interface Props {
    newsId: string
    comments: Comment[]
}

export function CommentSection({ newsId, comments }: Props) {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName.trim() || !email.trim() || !content.trim()) {
            toast.error("Lütfen tüm alanları doldurun.")
            return
        }

        setLoading(true)
        const result = await addNewsComment(newsId, {
            fullName,
            email,
            content
        })
        setLoading(false)

        if (result.success) {
            toast.success("Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır.")
            setFullName("")
            setEmail("")
            setContent("")
        } else {
            toast.error("Yorum gönderilirken bir hata oluştu: " + (result.message || "Bilinmeyen hata"))
        }
    }

    return (
        <section className="py-12 border-t border-white/10 mt-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Yorumlar</h3>
                    <p className="text-slate-400 text-sm">{comments.length} yorum</p>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6 mb-16">
                {comments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-white/5">
                        <MessageSquare className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">Henüz yorum bulunmuyor. İlk yorumu siz yapın!</p>
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 rounded-xl p-6 border border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                                    {comment.full_name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{comment.full_name}</h4>
                                    <p className="text-xs text-slate-500">
                                        {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Comment Form */}
            <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-6 md:p-8">
                <h4 className="text-xl font-bold text-white mb-6">Bir Yorum Yazın</h4>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                Ad Soyad <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="Adınız"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                E-posta <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            Yorum <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors min-h-[120px] resize-y"
                            placeholder="Düşüncelerinizi paylaşın..."
                            required
                        />
                        <div className="flex items-center gap-1.5 text-xs text-yellow-500/80 mt-2">
                            <Info className="h-3 w-3" />
                            <span>Yazılı kurallar: İçeriği incelendikten sonra yayınlanacaktır.</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Yorumu Gönder
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-blue-300">
                        <span className="font-semibold text-blue-200">Moderasyon:</span> Uygunsuz içerik barındıran yorumlar yayınlanmayacaktır. Tüm yorumlar yöneticiler tarafından incelenir.
                    </p>
                </div>
            </div>
        </section>
    )
}
