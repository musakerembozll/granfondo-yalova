"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, MailOpen, Trash2, Clock, User, Send, Archive, ArchiveRestore, RotateCcw, Loader2, Reply, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { markMessageAsRead, deleteContactMessage, replyToMessage, archiveMessage, unarchiveMessage, moveToTrash, restoreFromTrash } from "@/app/actions"

interface MessageReply {
    id: string
    reply_text: string
    admin_name: string
    created_at: string
}

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    created_at: string
    archived_at?: string
    deleted_at?: string
    replies?: MessageReply[]
}

interface Props {
    messages: Message[]
    currentFilter: 'inbox' | 'archive' | 'trash'
    adminName: string
}

export function MessagesClient({ messages, currentFilter, adminName }: Props) {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [replyText, setReplyText] = useState("")
    const [sending, setSending] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const router = useRouter()

    const unreadCount = messages.filter(m => m.status === 'unread').length

    const handleRead = async (msg: Message) => {
        setSelectedMessage(msg)
        setReplyText("")
        if (msg.status === 'unread') {
            await markMessageAsRead(msg.id)
            router.refresh()
        }
    }

    const handleReply = async () => {
        if (!selectedMessage || !replyText.trim()) return
        setSending(true)
        await replyToMessage(selectedMessage.id, replyText, adminName)
        setReplyText("")
        setSending(false)
        router.refresh()
        // Refresh selected message
        const updatedMessages = messages.map(m =>
            m.id === selectedMessage.id
                ? { ...m, status: 'replied', replies: [...(m.replies || []), { id: 'temp', reply_text: replyText, admin_name: adminName, created_at: new Date().toISOString() }] }
                : m
        )
        const updatedMsg = updatedMessages.find(m => m.id === selectedMessage.id)
        if (updatedMsg) setSelectedMessage(updatedMsg)
    }

    const handleArchive = async (id: string) => {
        setActionLoading(id)
        await archiveMessage(id)
        setSelectedMessage(null)
        setActionLoading(null)
        router.refresh()
    }

    const handleUnarchive = async (id: string) => {
        setActionLoading(id)
        await unarchiveMessage(id)
        setSelectedMessage(null)
        setActionLoading(null)
        router.refresh()
    }

    const handleMoveToTrash = async (id: string) => {
        setActionLoading(id)
        await moveToTrash(id)
        setSelectedMessage(null)
        setActionLoading(null)
        router.refresh()
    }

    const handleRestore = async (id: string) => {
        setActionLoading(id)
        await restoreFromTrash(id)
        setSelectedMessage(null)
        setActionLoading(null)
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı kalıcı olarak silmek istediğinizden emin misiniz?')) return
        await deleteContactMessage(id)
        setSelectedMessage(null)
        router.refresh()
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'unread': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Okunmadı</span>
            case 'read': return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full">Okundu</span>
            case 'replied': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Yanıtlandı</span>
            default: return null
        }
    }

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={currentFilter === 'inbox' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => router.push('/admin/messages?filter=inbox')}
                    className={currentFilter === 'inbox' ? 'bg-emerald-500' : ''}
                >
                    <Mail className="h-4 w-4 mr-2" />
                    Gelen Kutusu
                    {unreadCount > 0 && currentFilter === 'inbox' && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{unreadCount}</span>
                    )}
                </Button>
                <Button
                    variant={currentFilter === 'archive' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => router.push('/admin/messages?filter=archive')}
                    className={currentFilter === 'archive' ? 'bg-emerald-500' : ''}
                >
                    <Archive className="h-4 w-4 mr-2" />
                    Arşiv
                </Button>
                <Button
                    variant={currentFilter === 'trash' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => router.push('/admin/messages?filter=trash')}
                    className={currentFilter === 'trash' ? 'bg-emerald-500' : ''}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Çöp Kutusu
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Message List */}
                <div className="md:col-span-1 space-y-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-sm">
                            {messages.length} mesaj
                        </span>
                    </div>

                    {messages.length === 0 ? (
                        <Card className="bg-slate-900/50 border-white/5">
                            <CardContent className="py-8 text-center text-slate-500">
                                {currentFilter === 'inbox' && 'Gelen kutusu boş.'}
                                {currentFilter === 'archive' && 'Arşiv boş.'}
                                {currentFilter === 'trash' && 'Çöp kutusu boş.'}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => handleRead(msg)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedMessage?.id === msg.id
                                            ? 'bg-emerald-500/20 border-emerald-500/30'
                                            : 'bg-slate-900/50 border-white/5 hover:bg-slate-800/50'
                                        } border`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${msg.status === 'unread' ? 'bg-blue-500/20' : msg.status === 'replied' ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                                            {msg.status === 'unread' ? (
                                                <Mail className="h-4 w-4 text-blue-400" />
                                            ) : msg.status === 'replied' ? (
                                                <Reply className="h-4 w-4 text-emerald-400" />
                                            ) : (
                                                <MailOpen className="h-4 w-4 text-slate-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-medium truncate ${msg.status === 'unread' ? 'text-white' : 'text-slate-400'}`}>
                                                    {msg.name}
                                                </span>
                                                {msg.status === 'unread' && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">{msg.subject}</p>
                                            <p className="text-xs text-slate-600 mt-1">
                                                {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Detail */}
                <div className="md:col-span-2">
                    {selectedMessage ? (
                        <Card className="bg-slate-900/50 border-white/5">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl text-white flex items-center gap-3">
                                        {selectedMessage.subject}
                                        {getStatusBadge(selectedMessage.status)}
                                    </CardTitle>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            {selectedMessage.name}
                                        </span>
                                        <span>{selectedMessage.email}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {currentFilter === 'inbox' && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                                                onClick={() => handleArchive(selectedMessage.id)}
                                                disabled={actionLoading === selectedMessage.id}
                                            >
                                                <Archive className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleMoveToTrash(selectedMessage.id)}
                                                disabled={actionLoading === selectedMessage.id}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </>
                                    )}
                                    {currentFilter === 'archive' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            onClick={() => handleUnarchive(selectedMessage.id)}
                                            disabled={actionLoading === selectedMessage.id}
                                        >
                                            <ArchiveRestore className="h-5 w-5" />
                                        </Button>
                                    )}
                                    {currentFilter === 'trash' && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                                                onClick={() => handleRestore(selectedMessage.id)}
                                                disabled={actionLoading === selectedMessage.id}
                                            >
                                                <RotateCcw className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(selectedMessage.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Original Message */}
                                <div className="bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                                        <User className="h-4 w-4" />
                                        <span>{selectedMessage.name}</span>
                                        <span>•</span>
                                        <span>{new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</span>
                                    </div>
                                    <p className="text-slate-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                {/* Replies */}
                                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                                    <div className="space-y-3">
                                        {selectedMessage.replies.map((reply) => (
                                            <div key={reply.id} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 ml-8">
                                                <div className="flex items-center gap-2 mb-2 text-sm text-emerald-400">
                                                    <Reply className="h-4 w-4" />
                                                    <span>{reply.admin_name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(reply.created_at).toLocaleString('tr-TR')}</span>
                                                </div>
                                                <p className="text-slate-300 whitespace-pre-wrap">{reply.reply_text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Form - Only show in inbox */}
                                {currentFilter === 'inbox' && (
                                    <div className="pt-4 border-t border-white/10">
                                        <label className="block text-sm text-slate-400 mb-2">Yanıtla</label>
                                        <Textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Yanıtınızı yazın..."
                                            className="bg-slate-800 border-white/10 text-white min-h-[100px]"
                                        />
                                        <Button
                                            onClick={handleReply}
                                            disabled={sending || !replyText.trim()}
                                            className="mt-3 bg-emerald-500 hover:bg-emerald-600"
                                        >
                                            {sending ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Send className="h-4 w-4 mr-2" />
                                            )}
                                            Yanıt Gönder
                                        </Button>
                                        <p className="text-xs text-slate-500 mt-2">
                                            * Yanıtınız hem burada kaydedilecek hem de kullanıcıya e-posta olarak gönderilecek.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-slate-900/50 border-white/5 h-full">
                            <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                                <div className="text-center text-slate-500">
                                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Okumak için bir mesaj seçin</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
