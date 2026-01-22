"use client"

import { useState, useEffect } from "react"
import { Search, User, Mail, Phone, Calendar, ChevronRight, Ticket, Loader2, RefreshCw, Pencil, Trash2, X, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Application } from "@/lib/supabase"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface UserWithApplications {
    id: string
    full_name: string
    email?: string
    phone?: string
    gender?: 'male' | 'female'
    birth_date?: string
    created_at: string
    updated_at?: string
    provider?: string
    applications?: Application[]
}

export function UsersManager() {
    const [users, setUsers] = useState<UserWithApplications[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<UserWithApplications | null>(null)
    const [editingUser, setEditingUser] = useState<UserWithApplications | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/admin/users')
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch users')
            }

            if (data.users) {
                setUsers(data.users)
            }
        } catch (err) {
            console.error('Fetch users error:', err)
            setError(err instanceof Error ? err.message : 'Kullanıcılar yüklenemedi')
        } finally {
            setLoading(false)
        }
    }

    const handleEditUser = (user: UserWithApplications) => {
        setEditingUser({ ...user })
        setIsEditModalOpen(true)
    }

    const handleSaveUser = async () => {
        if (!editingUser) return

        setIsSaving(true)
        try {
            const response = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: editingUser.full_name,
                    email: editingUser.email,
                    phone: editingUser.phone,
                    gender: editingUser.gender,
                    birth_date: editingUser.birth_date
                })
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Kullanıcı güncellendi')
                setIsEditModalOpen(false)
                setEditingUser(null)
                fetchUsers()
            } else {
                toast.error(data.message || 'Güncelleme başarısız')
            }
        } catch (error) {
            toast.error('Bir hata oluştu')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteUser = async (user: UserWithApplications) => {
        if (!confirm(`"${user.full_name}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Kullanıcı silindi')
                if (selectedUser?.id === user.id) {
                    setSelectedUser(null)
                }
                fetchUsers()
            } else {
                toast.error(data.message || 'Silme başarısız')
            }
        } catch (error) {
            toast.error('Bir hata oluştu')
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredUsers = users.filter(
        (user) =>
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Kayıtlı Kullanıcılar</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    className="border-white/10 text-slate-400 hover:text-white"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                    placeholder="Kullanıcı ara (isim, e-posta veya telefon)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border-white/10 pl-10"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white">{users.length}</div>
                    <div className="text-sm text-slate-400">Toplam Kullanıcı</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-emerald-400">
                        {users.filter(u => (u.applications?.length || 0) > 0).length}
                    </div>
                    <div className="text-sm text-slate-400">Başvuru Yapan</div>
                </div>
            </div>

            {/* User List */}
            <div className="grid lg:grid-cols-2 gap-4">
                {/* Users */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Kullanıcılar ({filteredUsers.length})</h3>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className={`bg-slate-800/50 rounded-xl p-4 border transition-colors ${selectedUser?.id === user.id
                                    ? "border-emerald-500/50 bg-emerald-500/5"
                                    : "border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.full_name}</div>
                                            <div className="text-xs text-slate-400">{user.email || user.phone || "-"}</div>
                                        </div>
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {(user.applications?.length || 0) > 0 && (
                                            <div className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                                                {user.applications?.length} başvuru
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditUser(user)}
                                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteUser(user)}
                                            disabled={isDeleting}
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                Kullanıcı bulunamadı.
                            </div>
                        )}
                    </div>
                </div>

                {/* User Details */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Kullanıcı Detayları</h3>
                    {selectedUser ? (
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 space-y-6">
                            {/* Profile Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-white">{selectedUser.full_name}</div>
                                        <div className="text-sm text-slate-400">
                                            Kayıt: {formatDate(selectedUser.created_at)}
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                {selectedUser.email && (
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        <a href={`mailto:${selectedUser.email}`} className="text-sm text-emerald-400 hover:underline">
                                            {selectedUser.email}
                                        </a>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm">{selectedUser.phone || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm">{selectedUser.birth_date || "-"}</span>
                                    </div>
                                </div>

                                {/* Provider Badge */}
                                {selectedUser.provider && (
                                    <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                        {selectedUser.provider === 'google' ? '🔵 Google' : selectedUser.provider}
                                    </div>
                                )}
                            </div>

                            {/* Applications */}
                            <div>
                                <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                                    <Ticket className="h-4 w-4 text-emerald-400" />
                                    Başvurular
                                </h4>
                                {selectedUser.applications && selectedUser.applications.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedUser.applications.map((app) => (
                                            <div
                                                key={app.id}
                                                className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="text-white text-sm">
                                                        {app.category === "long" ? "Uzun Parkur" : "Kısa Parkur"}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {formatDate(app.created_at)}
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${app.status === "approved"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : app.status === "rejected"
                                                        ? "bg-red-500/20 text-red-400"
                                                        : "bg-yellow-500/20 text-yellow-400"
                                                    }`}>
                                                    {app.status === "approved" ? "Onaylandı" : app.status === "rejected" ? "Reddedildi" : "Beklemede"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-400 text-center py-4 bg-slate-900/50 rounded-lg">
                                        Henüz başvuru yok
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2 border-t border-white/10">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditUser(selectedUser)}
                                    className="flex-1 border-white/10 text-white hover:bg-white/10"
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Düzenle
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteUser(selectedUser)}
                                    disabled={isDeleting}
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Sil
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 rounded-xl p-8 border border-white/10 text-center text-slate-400">
                            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Detayları görmek için bir kullanıcı seçin</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-slate-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Kullanıcı Düzenle</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Kullanıcı bilgilerini güncelleyin.
                        </DialogDescription>
                    </DialogHeader>

                    {editingUser && (
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Ad Soyad</label>
                                <Input
                                    value={editingUser.full_name}
                                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-2">E-posta</label>
                                <Input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Telefon</label>
                                <Input
                                    value={editingUser.phone || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 block mb-2">Cinsiyet</label>
                                    <select
                                        value={editingUser.gender || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value as 'male' | 'female' })}
                                        className="w-full bg-slate-800 border border-white/10 rounded-md px-3 py-2 text-white"
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="male">Erkek</option>
                                        <option value="female">Kadın</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 block mb-2">Doğum Tarihi</label>
                                    <Input
                                        type="date"
                                        value={editingUser.birth_date || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, birth_date: e.target.value })}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 border-white/10 text-slate-400"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleSaveUser}
                                    disabled={isSaving}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Kaydet
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
