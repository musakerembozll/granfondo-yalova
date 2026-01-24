"use client"

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getEvent, updateEvent, setActiveEvent } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast as sonnerToast } from "sonner";

interface PageProps {
    params: Promise<{ id: string }>
}

export default function EditEventPage({ params }: PageProps) {
    const { id } = use(params);
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [event, setEvent] = useState<{
        id: string;
        title: string;
        date: string;
        location: string;
        status: string;
        description?: string;
        photo_url?: string;
        background_image_url?: string;
        active_event?: boolean;
        applications_open?: boolean;
        short_price?: number;
        long_price?: number;
    } | null>(null);

    useEffect(() => {
        async function fetchEvent() {
            const data = await getEvent(id);
            setEvent(data);
            setFetching(false);
        }
        fetchEvent();
    }, [id]);

    const handleFileUpload = async (field: 'photo_url' | 'background_image_url', file: File) => {
        setUploading(field);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('key', `event_${id}_${field}`);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            setEvent(prev => prev ? { ...prev, [field]: result.url } : null);
            sonnerToast.success('Dosya yüklendi');
        } catch (error) {
            console.error('Upload error:', error);
            sonnerToast.error('Yükleme hatası');
        } finally {
            setUploading(null);
        }
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = {
            title: formData.get("title"),
            date: formData.get("date"),
            location: formData.get("location"),
            status: formData.get("status"),
            description: formData.get("description") || "",
            photo_url: event?.photo_url || "",
            background_image_url: event?.background_image_url || "",
            active_event: formData.get("active_event") === "on",
            applications_open: formData.get("applications_open") === "on",
            short_price: formData.get("short_price") ? Number(formData.get("short_price")) : undefined,
            long_price: formData.get("long_price") ? Number(formData.get("long_price")) : undefined,
        };

        try {
            const result = await updateEvent(id, data);
            if (result.success) {
                // If setting as active, also call setActiveEvent to ensure only one is active
                if (data.active_event) {
                    await setActiveEvent(id);
                }
                toast({
                    title: "Başarılı",
                    description: result.message,
                    className: "bg-emerald-500 border-none text-white",
                });
                router.push("/admin/events");
            } else {
                toast({
                    title: "Hata",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Hata",
                description: "Bir hata oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl text-white">Etkinlik bulunamadı</h2>
                <Link href="/admin/events">
                    <Button className="mt-4">Etkinliklere Dön</Button>
                </Link>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/events">
                    <Button variant="outline" size="icon" type="button">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-white">Etkinlik Düzenle</h1>
            </div>

            <div className="grid gap-6">
                {/* Basic Info */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Etkinlik Bilgileri</CardTitle>
                        <CardDescription className="text-slate-400">
                            Temel etkinlik bilgilerini güncelleyin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-slate-300">Etkinlik Adı</Label>
                            <Input
                                name="title"
                                id="title"
                                defaultValue={event.title}
                                placeholder="Örn: GranFondo Yalova 2026"
                                className="bg-slate-950 border-white/10 text-white"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date" className="text-slate-300">Tarih</Label>
                                <Input
                                    name="date"
                                    id="date"
                                    type="date"
                                    defaultValue={event.date}
                                    className="bg-slate-950 border-white/10 text-white"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location" className="text-slate-300">Konum</Label>
                                <Input
                                    name="location"
                                    id="location"
                                    defaultValue={event.location}
                                    placeholder="Örn: Yalova, Türkiye"
                                    className="bg-slate-950 border-white/10 text-white"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status" className="text-slate-300">Durum</Label>
                                <Select name="status" defaultValue={event.status}>
                                    <SelectTrigger className="bg-slate-950 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="published">Yayında</SelectItem>
                                        <SelectItem value="draft">Taslak</SelectItem>
                                        <SelectItem value="cancelled">İptal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-slate-300">Açıklama</Label>
                            <Textarea
                                name="description"
                                id="description"
                                defaultValue={event.description || ""}
                                placeholder="Etkinlik hakkında detaylı bilgi..."
                                className="min-h-[150px] bg-slate-950 border-white/10 text-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Media */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-emerald-400" />
                            Görseller
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Etkinlik fotoğrafı ve arka plan görseli. Fotoğraftan otomatik renk çıkarımı yapılacak.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-slate-300">Etkinlik Fotoğrafı</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={event.photo_url || ""}
                                    onChange={(e) => setEvent(prev => prev ? { ...prev, photo_url: e.target.value } : null)}
                                    placeholder="https://..."
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo-upload"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload('photo_url', file);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('photo-upload')?.click()}
                                    disabled={uploading === 'photo_url'}
                                    className="bg-slate-800 border-white/10"
                                >
                                    {uploading === 'photo_url' ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {event.photo_url && (
                                <div className="mt-2 w-full aspect-video rounded overflow-hidden bg-slate-800">
                                    <img src={event.photo_url} alt="Event photo" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-slate-300">Ana Sayfa Arka Plan Görseli</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={event.background_image_url || ""}
                                    onChange={(e) => setEvent(prev => prev ? { ...prev, background_image_url: e.target.value } : null)}
                                    placeholder="https://..."
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="bg-upload"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload('background_image_url', file);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('bg-upload')?.click()}
                                    disabled={uploading === 'background_image_url'}
                                    className="bg-slate-800 border-white/10"
                                >
                                    {uploading === 'background_image_url' ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {event.background_image_url && (
                                <div className="mt-2 w-full aspect-video rounded overflow-hidden bg-slate-800">
                                    <img src={event.background_image_url} alt="Background" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Settings */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Ayarlar</CardTitle>
                        <CardDescription className="text-slate-400">
                            Etkinlik durumu ve başvuru ayarları.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-emerald-400" />
                                <div>
                                    <Label htmlFor="active_event" className="text-white font-medium cursor-pointer">
                                        Ana Sayfa Etkinliği Yap
                                    </Label>
                                    <p className="text-xs text-slate-400">Bu etkinliği ana sayfada göster</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                name="active_event"
                                id="active_event"
                                defaultChecked={event.active_event}
                                className="w-5 h-5 rounded border-white/20 bg-slate-800 text-emerald-500"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                            <div>
                                <Label htmlFor="applications_open" className="text-slate-300 font-medium cursor-pointer">
                                    Başvurular Açık
                                </Label>
                                <p className="text-xs text-slate-400">Bu etkinlik için başvuru alınıyor mu?</p>
                            </div>
                            <input
                                type="checkbox"
                                name="applications_open"
                                id="applications_open"
                                defaultChecked={event.applications_open !== false}
                                className="w-5 h-5 rounded border-white/20 bg-slate-800 text-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="short_price" className="text-slate-300">Kısa Parkur Ücreti (TL)</Label>
                                <Input
                                    name="short_price"
                                    id="short_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={event.short_price || ""}
                                    placeholder="500"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="long_price" className="text-slate-300">Uzun Parkur Ücreti (TL)</Label>
                                <Input
                                    name="long_price"
                                    id="long_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={event.long_price || ""}
                                    placeholder="750"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/admin/events">
                        <Button variant="ghost" type="button" className="text-slate-400 hover:text-white hover:bg-white/10">İptal</Button>
                    </Link>
                    <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
