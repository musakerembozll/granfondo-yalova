"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, Upload, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Sponsor {
    id: string
    name: string
    logo_url: string
    website?: string
    order_index: number
}

export function SponsorManager() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [newSponsor, setNewSponsor] = useState({ name: "", logo_url: "", website: "" })

    useEffect(() => {
        fetchSponsors()
    }, [])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('key', `sponsor_${Date.now()}`)
            
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
            
            const result = await response.json()
            
            if (response.ok && result.url) {
                setNewSponsor(prev => ({ ...prev, logo_url: result.url }))
                toast.success('Logo yüklendi!')
            } else {
                toast.error('Yükleme başarısız: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Yükleme sırasında hata oluştu')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const fetchSponsors = async () => {
        const { data } = await supabase
            .from("sponsors")
            .select("*")
            .order("order_index", { ascending: true })

        if (data) setSponsors(data)
        setLoading(false)
    }

    const addSponsor = async () => {
        if (!newSponsor.name) {
            toast.error("Sponsor adı gerekli")
            return
        }

        const { error } = await supabase.from("sponsors").insert({
            name: newSponsor.name,
            logo_url: newSponsor.logo_url || "🏢",
            website: newSponsor.website || null,
            order_index: sponsors.length
        })

        if (error) {
            toast.error("Sponsor eklenemedi")
        } else {
            toast.success("Sponsor eklendi")
            setNewSponsor({ name: "", logo_url: "", website: "" })
            fetchSponsors()
        }
    }

    const deleteSponsor = async (id: string) => {
        if (!confirm("Bu sponsoru silmek istediğinize emin misiniz?")) return

        const { error } = await supabase.from("sponsors").delete().eq("id", id)

        if (error) {
            toast.error("Sponsor silinemedi")
        } else {
            toast.success("Sponsor silindi")
            fetchSponsors()
        }
    }

    if (loading) {
        return <div className="text-slate-400">Yükleniyor...</div>
    }

    return (
        <div className="space-y-6">
            {/* Yeni Sponsor Ekle */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">Yeni Sponsor Ekle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Sponsor Adı"
                                value={newSponsor.name}
                                onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                                className="bg-slate-800 border-white/10 text-white"
                            />
                            <Input
                                placeholder="Website (opsiyonel)"
                                value={newSponsor.website}
                                onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                                className="bg-slate-800 border-white/10 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Logo</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Logo URL veya Emoji (🏢) veya dosya yükleyin"
                                    value={newSponsor.logo_url}
                                    onChange={(e) => setNewSponsor({ ...newSponsor, logo_url: e.target.value })}
                                    className="bg-slate-800 border-white/10 text-white flex-1"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="bg-slate-800 border-white/10 hover:bg-slate-700 text-white"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    <span className="ml-2 hidden sm:inline">{uploading ? 'Yükleniyor...' : 'Logo Yükle'}</span>
                                </Button>
                            </div>
                            {newSponsor.logo_url && newSponsor.logo_url.startsWith('http') && (
                                <div className="mt-2">
                                    <img 
                                        src={newSponsor.logo_url} 
                                        alt="Logo önizleme" 
                                        className="h-12 w-auto object-contain rounded border border-white/10 bg-white p-1"
                                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                    />
                                </div>
                            )}
                        </div>
                        <Button onClick={addSponsor} className="bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Sponsor Ekle
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Mevcut Sponsorlar */}
            <Card className="bg-slate-900/50 border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">Mevcut Sponsorlar ({sponsors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {sponsors.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">Henüz sponsor eklenmedi</p>
                    ) : (
                        <div className="space-y-3">
                            {sponsors.map((sponsor) => (
                                <div
                                    key={sponsor.id}
                                    className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-white/5"
                                >
                                    <GripVertical className="h-5 w-5 text-slate-600 cursor-move" />
                                    <div className="text-2xl">{sponsor.logo_url}</div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{sponsor.name}</p>
                                        {sponsor.website && (
                                            <p className="text-slate-400 text-sm">{sponsor.website}</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteSponsor(sponsor.id)}
                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
