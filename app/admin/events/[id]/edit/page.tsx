"use client"

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon, Star, CreditCard, Phone, Palette, Video } from "lucide-react";
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
import { THEME_PRESETS } from "@/lib/theme-presets";

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
        hero_video_url?: string;
        active_event?: boolean;
        applications_open?: boolean;
        short_price?: number;
        long_price?: number;
        // Payment
        bank_name?: string;
        account_holder?: string;
        iban?: string;
        // Contact
        contact_email?: string;
        contact_phone?: string;
        // Theme
        theme_preset?: string;
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
            hero_video_url: event?.hero_video_url || "",
            active_event: formData.get("active_event") === "on",
            applications_open: formData.get("applications_open") === "on",
            short_price: formData.get("short_price") ? Number(formData.get("short_price")) : undefined,
            long_price: formData.get("long_price") ? Number(formData.get("long_price")) : undefined,
            // Payment
            bank_name: formData.get("bank_name") || "",
            account_holder: formData.get("account_holder") || "",
            iban: formData.get("iban") || "",
            // Contact
            contact_email: formData.get("contact_email") || "",
            contact_phone: formData.get("contact_phone") || "",
            // Theme
            theme_preset: formData.get("theme_preset") || "emerald",
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

                        {/* Hero Video */}
                        <div className="grid gap-2">
                            <Label className="text-slate-300 flex items-center gap-2">
                                <Video className="h-4 w-4" />
                                Ana Sayfa Video (Opsiyonel)
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={event.hero_video_url || ""}
                                    onChange={(e) => setEvent(prev => prev ? { ...prev, hero_video_url: e.target.value } : null)}
                                    placeholder="https://... (MP4 video URL)"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    id="video-upload"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setUploading('hero_video_url');
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            formData.append('key', `event_${id}_video`);
                                            fetch('/api/admin/upload', { method: 'POST', body: formData })
                                                .then(r => r.json())
                                                .then(result => {
                                                    if (result.url) {
                                                        setEvent(prev => prev ? { ...prev, hero_video_url: result.url } : null);
                                                        sonnerToast.success('Video yüklendi');
                                                    }
                                                })
                                                .catch(() => sonnerToast.error('Video yükleme hatası'))
                                                .finally(() => setUploading(null));
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('video-upload')?.click()}
                                    disabled={uploading === 'hero_video_url'}
                                    className="bg-slate-800 border-white/10"
                                >
                                    {uploading === 'hero_video_url' ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {event.hero_video_url && (
                                <div className="mt-2 w-full aspect-video rounded overflow-hidden bg-slate-800">
                                    <video src={event.hero_video_url} controls muted className="w-full h-full object-contain" />
                                </div>
                            )}
                            <p className="text-xs text-slate-500">Video yoksa arka plan görseli gösterilir</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme Selection */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple-400" />
                            Tema Rengi
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Bu etkinlik aktif olduğunda sitenin tamamı bu tema renklerini kullanacak
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(THEME_PRESETS).map(([key, theme]) => (
                                <label
                                    key={key}
                                    className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        event.theme_preset === key 
                                            ? 'border-white bg-white/10' 
                                            : 'border-white/10 hover:border-white/30'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="theme_preset"
                                        value={key}
                                        checked={event.theme_preset === key}
                                        onChange={() => setEvent(prev => prev ? { ...prev, theme_preset: key } : null)}
                                        className="sr-only"
                                    />
                                    <div 
                                        className="w-10 h-10 rounded-full mb-2"
                                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                                    />
                                    <span className="text-sm text-white">{theme.name}</span>
                                    {event.theme_preset === key && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Info */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-amber-400" />
                            Ödeme Bilgileri
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Bu etkinlik için ödeme alınacak banka bilgileri
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="bank_name" className="text-slate-300">Banka Adı</Label>
                                <Input
                                    name="bank_name"
                                    id="bank_name"
                                    defaultValue={event.bank_name || ""}
                                    placeholder="Ziraat Bankası"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="account_holder" className="text-slate-300">Hesap Sahibi</Label>
                                <Input
                                    name="account_holder"
                                    id="account_holder"
                                    defaultValue={event.account_holder || ""}
                                    placeholder="GranFondo Yalova Spor Kulübü"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="iban" className="text-slate-300">IBAN</Label>
                            <Input
                                name="iban"
                                id="iban"
                                defaultValue={event.iban || ""}
                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                                className="bg-slate-950 border-white/10 text-white font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Phone className="h-5 w-5 text-cyan-400" />
                            İletişim Bilgileri
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Bu etkinlik için iletişim bilgileri
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="contact_email" className="text-slate-300">E-posta</Label>
                                <Input
                                    name="contact_email"
                                    id="contact_email"
                                    type="email"
                                    defaultValue={event.contact_email || ""}
                                    placeholder="info@etkinlik.com"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_phone" className="text-slate-300">Telefon</Label>
                                <Input
                                    name="contact_phone"
                                    id="contact_phone"
                                    defaultValue={event.contact_phone || ""}
                                    placeholder="+90 (5XX) XXX XX XX"
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
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
