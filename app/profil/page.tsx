"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bike, User, Mail, Phone, Calendar, Edit2, LogOut, Ticket, Loader2, Save, X, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { useAuth } from "@/contexts/auth-context"
import { supabase, Application } from "@/lib/supabase"

export default function ProfilePage() {
    const router = useRouter()
    const { user, profile, loading, signOut, updateProfile } = useAuth()
    const [applications, setApplications] = useState<Application[]>([])
    const [loadingApps, setLoadingApps] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editForm, setEditForm] = useState<{
        full_name: string
        phone: string
        gender: 'male' | 'female' | ''
        birth_date: string
    }>({
        full_name: "",
        phone: "",
        gender: "",
        birth_date: ""
    })

    // Check if profile is incomplete (for OAuth users)
    const isProfileIncomplete = profile && (!profile.phone || !profile.gender || !profile.birth_date)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/giris")
        }
    }, [loading, user, router])

    useEffect(() => {
        if (profile) {
            setEditForm({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                gender: profile.gender || "",
                birth_date: profile.birth_date || ""
            })
            // Auto-open edit mode if profile is incomplete
            if (!profile.phone || !profile.gender || !profile.birth_date) {
                setEditing(true)
            }
        }
    }, [profile])

    const fetchApplications = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

        if (!error && data) {
            setApplications(data)
        }
        setLoadingApps(false)
    }

    useEffect(() => {
        if (user) {
            fetchApplications()
        }
    }, [user])

    const handleSave = async () => {
        setSaving(true)
        const updateData = {
            ...editForm,
            gender: editForm.gender === '' ? undefined : editForm.gender
        }
        await updateProfile(updateData)
        setSaving(false)
        setEditing(false)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push("/")
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </main>
        )
    }

    if (!user) {
        return null
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Onaylandı</span>
            case "rejected":
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Reddedildi</span>
            default:
                return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Beklemede</span>
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />

            <div className="flex-1 container px-4 py-32 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Profilim</h1>
                        <Button onClick={handleSignOut} variant="outline" className="border-slate-700 text-slate-400">
                            <LogOut className="h-4 w-4 mr-2" />
                            Çıkış Yap
                        </Button>
                    </div>

                    {/* Incomplete Profile Warning */}
                    {isProfileIncomplete && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3"
                        >
                            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-400">Profilinizi Tamamlayın</h3>
                                <p className="text-sm text-amber-200/70 mt-1">
                                    Yarışa başvuru yapabilmek için telefon, cinsiyet ve doğum tarihi bilgilerinizi girmeniz gerekmektedir.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-emerald-400" />
                                Kişisel Bilgiler
                            </h2>
                            {!editing && (
                                <Button onClick={() => setEditing(true)} variant="ghost" size="sm" className="text-emerald-400">
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Düzenle
                                </Button>
                            )}
                        </div>

                        {editing ? (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Ad Soyad</label>
                                        <Input
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">
                                            Telefon
                                            {!profile?.phone && <span className="text-amber-400 ml-1">*</span>}
                                        </label>
                                        <Input
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            placeholder="0555 123 45 67"
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">
                                            Cinsiyet
                                            {!profile?.gender && <span className="text-amber-400 ml-1">*</span>}
                                        </label>
                                        <RadioGroup
                                            value={editForm.gender}
                                            onValueChange={(val) => setEditForm({ ...editForm, gender: val as 'male' | 'female' })}
                                            className="flex gap-4 mt-3"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="male" id="male" className="border-slate-600 text-emerald-500" />
                                                <label htmlFor="male" className="text-slate-300 text-sm">Erkek</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="female" id="female" className="border-slate-600 text-emerald-500" />
                                                <label htmlFor="female" className="text-slate-300 text-sm">Kadın</label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">
                                            Doğum Tarihi
                                            {!profile?.birth_date && <span className="text-amber-400 ml-1">*</span>}
                                        </label>
                                        <Input
                                            type="date"
                                            value={editForm.birth_date}
                                            onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving || !editForm.phone || !editForm.gender || !editForm.birth_date}
                                        className="bg-emerald-500 hover:bg-emerald-600"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                        Kaydet
                                    </Button>
                                    {!isProfileIncomplete && (
                                        <Button onClick={() => setEditing(false)} variant="outline" className="border-slate-700">
                                            <X className="h-4 w-4 mr-2" />
                                            İptal
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase">Ad Soyad</div>
                                        <div className="text-white">{profile?.full_name || user.user_metadata?.full_name || "-"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase">E-posta</div>
                                        <div className="text-white">{user.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase">Telefon</div>
                                        <div className="text-white">{profile?.phone || "-"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase">Doğum Tarihi</div>
                                        <div className="text-white">{profile?.birth_date || "-"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Applications */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Ticket className="h-5 w-5 text-emerald-400" />
                                Başvurularım
                            </h2>
                            <Link href="/basvuru">
                                <Button
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                    size="sm"
                                    disabled={!!isProfileIncomplete}
                                >
                                    Yeni Başvuru
                                </Button>
                            </Link>
                        </div>

                        {loadingApps ? (
                            <div className="text-center py-8">
                                <Loader2 className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Henüz başvuru yapmadınız.</p>
                                {isProfileIncomplete ? (
                                    <p className="text-sm text-amber-400 mt-2">Başvuru yapmak için önce profilinizi tamamlayın.</p>
                                ) : (
                                    <Link href="/basvuru">
                                        <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                                            İlk Başvurunuzu Yapın
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-medium text-white">
                                                {app.category === "long" ? "Uzun Parkur (98km)" : "Kısa Parkur (55km)"}
                                            </div>
                                            <div className="text-sm text-slate-400">
                                                {new Date(app.created_at).toLocaleDateString("tr-TR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })}
                                            </div>
                                        </div>
                                        {getStatusBadge(app.status)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}
