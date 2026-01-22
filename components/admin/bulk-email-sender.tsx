"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Users, Mail, AlertCircle, Check, Loader2, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Participant {
    id: string
    fullName: string
    email: string
    category: string
    status: string
}

interface RegisteredUser {
    id: string
    full_name: string
    email: string
}

interface BulkEmailSenderProps {
    participants: Participant[]
}

type RecipientType = 'applications' | 'users'

export function BulkEmailSender({ participants }: BulkEmailSenderProps) {
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('approved')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [recipientType, setRecipientType] = useState<RecipientType>('applications')
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)

    // Fetch registered users when switching to users tab
    useEffect(() => {
        if (recipientType === 'users' && registeredUsers.length === 0) {
            fetchRegisteredUsers()
        }
    }, [recipientType])

    const fetchRegisteredUsers = async () => {
        setLoadingUsers(true)
        try {
            const response = await fetch('/api/admin/users')
            const data = await response.json()
            if (data.users) {
                setRegisteredUsers(data.users.filter((u: RegisteredUser) => u.email))
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoadingUsers(false)
        }
    }

    const filteredParticipants = participants.filter(p => {
        if (filter === 'all') return true
        return p.status === filter
    })

    // Get current list based on recipient type
    const currentList = recipientType === 'applications'
        ? filteredParticipants.map(p => ({ id: p.id, name: p.fullName, email: p.email }))
        : registeredUsers.map(u => ({ id: u.id, name: u.full_name, email: u.email }))

    const handleSelectAll = () => {
        if (selectedIds.size === currentList.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(currentList.map(p => p.id)))
        }
    }

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const handleSend = async () => {
        if (!subject || !content || selectedIds.size === 0) return

        setSending(true)

        try {
            // Get selected emails
            const selectedEmails = currentList
                .filter(p => selectedIds.has(p.id))
                .map(p => p.email)
                .filter(Boolean)

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedEmails,
                    subject,
                    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">GranFondo Yalova</h2>
                        <div style="white-space: pre-wrap;">${content}</div>
                    </div>`
                })
            })

            if (response.ok) {
                setSent(true)
                setTimeout(() => {
                    setSent(false)
                    setSubject("")
                    setContent("")
                    setSelectedIds(new Set())
                }, 3000)
            }
        } catch (error) {
            console.error('Failed to send emails:', error)
        } finally {
            setSending(false)
        }
    }

    // Reset selection when switching recipient type
    useEffect(() => {
        setSelectedIds(new Set())
    }, [recipientType])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Send className="h-8 w-8 text-emerald-400" />
                    Toplu Email
                </h1>
                <p className="text-slate-400 mt-1">Katılımcılara toplu duyuru e-postası gönderin</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recipient Selection */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-400" />
                            Alıcılar
                        </h3>
                        <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                            {selectedIds.size} seçili
                        </span>
                    </div>

                    {/* Recipient Type Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setRecipientType('applications')}
                            className={`flex-1 text-xs px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${recipientType === 'applications'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            <Users className="h-3 w-3" />
                            Başvuranlar
                        </button>
                        <button
                            onClick={() => setRecipientType('users')}
                            className={`flex-1 text-xs px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${recipientType === 'users'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            <UserCheck className="h-3 w-3" />
                            Kullanıcılar
                        </button>
                    </div>

                    {/* Filter - Only show for applications */}
                    {recipientType === 'applications' && (
                        <div className="flex gap-2 mb-4">
                            {[
                                { value: 'approved', label: 'Onaylı' },
                                { value: 'pending', label: 'Bekleyen' },
                                { value: 'all', label: 'Tümü' },
                            ].map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value as typeof filter)}
                                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${filter === f.value
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Loading state for users */}
                    {recipientType === 'users' && loadingUsers ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Select All */}
                            <button
                                onClick={handleSelectAll}
                                className="w-full text-left p-3 mb-2 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors flex items-center gap-3"
                            >
                                <div className={`w-4 h-4 rounded border ${selectedIds.size === currentList.length && currentList.length > 0
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-slate-600'
                                    } flex items-center justify-center`}>
                                    {selectedIds.size === currentList.length && currentList.length > 0 && (
                                        <Check className="h-3 w-3 text-white" />
                                    )}
                                </div>
                                <span className="text-sm text-slate-400">Tümünü Seç ({currentList.length})</span>
                            </button>

                            {/* Recipient List */}
                            <div className="space-y-1 max-h-[400px] overflow-y-auto">
                                {currentList.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleSelect(item.id)}
                                        className="w-full text-left p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors flex items-center gap-3"
                                    >
                                        <div className={`w-4 h-4 rounded border ${selectedIds.has(item.id)
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-slate-600'
                                            } flex items-center justify-center`}>
                                            {selectedIds.has(item.id) && (
                                                <Check className="h-3 w-3 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-white truncate">{item.name}</div>
                                            <div className="text-xs text-slate-500 truncate">{item.email}</div>
                                        </div>
                                    </button>
                                ))}

                                {currentList.length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-sm">
                                        {recipientType === 'users' ? 'Kayıtlı kullanıcı bulunamadı' : 'Katılımcı bulunamadı'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Email Composer */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                        <Mail className="h-4 w-4 text-emerald-400" />
                        E-posta İçeriği
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">Konu</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="E-posta konusu..."
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-400 block mb-2">İçerik</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="E-posta içeriğini yazın..."
                                rows={10}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
                            />
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-start gap-2 text-sm text-slate-400">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="text-yellow-500 font-medium">Bilgi</p>
                                    <p>E-postalar seçilen {selectedIds.size} katılımcıya gönderilecektir. Bu işlem geri alınamaz.</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleSend}
                            disabled={!subject || !content || selectedIds.size === 0 || sending}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed h-12"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Gönderiliyor...
                                </>
                            ) : sent ? (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Gönderildi!
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    {selectedIds.size} Kişiye Gönder
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
