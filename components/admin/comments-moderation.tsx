"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, CheckCircle, Trash2, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { approveNewsComment, deleteNewsComment } from "@/app/content-actions"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Comment {
    id: string
    news_id: string
    news_title?: string
    author_name: string
    author_email: string
    content: string
    is_approved: boolean
    created_at: string
}

export function CommentsModeration() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')

    useEffect(() => {
        fetchComments()
    }, [])

    const fetchComments = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('blog_comments')
                .select(`
                    *,
                    news:news_id(id, title)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            const mappedData = data?.map(c => ({
                ...c,
                news_title: c.news?.title || 'Bilinmeyen Haber'
            })) || []

            setComments(mappedData)
        } catch (error) {
            console.error('Fetch comments error:', error)
            toast.error('Yorumlar yüklenemedi')
        }
        setLoading(false)
    }

    const handleApprove = async (commentId: string) => {
        setActionLoading(commentId)
        const result = await approveNewsComment(commentId)

        if (result.success) {
            setComments(prev => 
                prev.map(c => c.id === commentId ? { ...c, is_approved: true } : c)
            )
            toast.success('Yorum yayınlandı')
        } else {
            toast.error('İşlem başarısız oldu')
        }
        setActionLoading(null)
    }

    const handleDelete = async (commentId: string) => {
        if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

        setActionLoading(commentId)
        const result = await deleteNewsComment(commentId)

        if (result.success) {
            setComments(prev => prev.filter(c => c.id !== commentId))
            toast.success('Yorum silindi')
        } else {
            toast.error('Silme işlemi başarısız oldu')
        }
        setActionLoading(null)
    }

    const filteredComments = comments.filter(c => {
        if (filter === 'pending') return !c.is_approved
        if (filter === 'approved') return c.is_approved
        return true
    })

    const pendingCount = comments.filter(c => !c.is_approved).length
    const approvedCount = comments.filter(c => c.is_approved).length

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
                    <MessageCircle className="h-8 w-8 text-emerald-400" />
                    Yorum Yönetimi
                </h1>
                <p className="text-slate-400">
                    Blog yazılarına gelen yorumları moderasyon yapın
                </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-slate-900/50 border-white/10">
                    <CardContent className="p-4">
                        <p className="text-sm text-slate-400 mb-1">Toplam Yorum</p>
                        <p className="text-3xl font-bold text-white">{comments.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-amber-400 mb-1">Beklemede</p>
                        <p className="text-3xl font-bold text-amber-400">{pendingCount}</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardContent className="p-4">
                        <p className="text-sm text-emerald-400 mb-1">Yayınlanan</p>
                        <p className="text-3xl font-bold text-emerald-400">{approvedCount}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={filter} onValueChange={(val) => setFilter(val as any)} className="w-full">
                <TabsList className="bg-slate-800/50 border border-white/10">
                    <TabsTrigger value="pending" className="text-white data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                        Beklemede ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="text-white data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        Yayınlanan ({approvedCount})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        Tümü ({comments.length})
                    </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8"
                        >
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
                            <p className="text-slate-400 mt-2">Yorumlar yükleniyor...</p>
                        </motion.div>
                    ) : filteredComments.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">
                                {filter === 'pending' && 'Beklemede yorum yok'}
                                {filter === 'approved' && 'Yayınlanan yorum yok'}
                                {filter === 'all' && 'Yorum yok'}
                            </p>
                        </motion.div>
                    ) : (
                        <TabsContent value={filter} className="space-y-3 mt-6">
                            {filteredComments.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className={`bg-slate-900/50 border-white/10 ${
                                        !comment.is_approved ? 'ring-1 ring-amber-500/50' : ''
                                    }`}>
                                        <CardContent className="p-5">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-white flex items-center gap-2">
                                                        {comment.author_name}
                                                        {!comment.is_approved && (
                                                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                                                                Beklemede
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-slate-500">{comment.author_email}</p>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            {/* News Link */}
                                            <a 
                                                href={`/haberler/${comment.news_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-emerald-400 hover:text-emerald-300 mb-3 block truncate"
                                            >
                                                📰 {comment.news_title}
                                            </a>

                                            {/* Content */}
                                            <p className="text-slate-300 mb-4 leading-relaxed">
                                                {comment.content}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                                {!comment.is_approved && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleApprove(comment.id)}
                                                        disabled={actionLoading === comment.id}
                                                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                    >
                                                        {actionLoading === comment.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                        )}
                                                        Onayla
                                                    </Button>
                                                )}

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(comment.id)}
                                                    disabled={actionLoading === comment.id}
                                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                >
                                                    {actionLoading === comment.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                    )}
                                                    Sil
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    className="ml-auto border-slate-700 text-slate-400 hover:bg-white/10"
                                                >
                                                    <a 
                                                        href={`/haberler/${comment.news_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Haberi Gör
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </TabsContent>
                    )}
                </AnimatePresence>
            </Tabs>
        </div>
    )
}
