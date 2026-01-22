"use client"

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEvent, updateEvent } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>
}

export default function EditEventPage({ params }: PageProps) {
    const { id } = use(params);
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [event, setEvent] = useState<{
        id: string;
        title: string;
        date: string;
        location: string;
        status: string;
    } | null>(null);

    useEffect(() => {
        async function fetchEvent() {
            const data = await getEvent(id);
            setEvent(data);
            setFetching(false);
        }
        fetchEvent();
    }, [id]);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = {
            title: formData.get("title"),
            date: formData.get("date"),
            location: formData.get("location"),
            status: formData.get("status"),
        };

        try {
            const result = await updateEvent(id, data);
            if (result.success) {
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

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2 bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Etkinlik Detayları</CardTitle>
                        <CardDescription className="text-slate-400">
                            Etkinlik bilgilerini güncelleyin.
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

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/admin/events">
                                <Button variant="ghost" type="button" className="text-slate-400 hover:text-white hover:bg-white/10">İptal</Button>
                            </Link>
                            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
