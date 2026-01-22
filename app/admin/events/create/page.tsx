"use client"

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateEventPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = {
            title: formData.get("title"),
            date: formData.get("date"),
            location: formData.get("location"),
            description: formData.get("description"),
        };

        try {
            const result = await createEvent(data);
            if (result.success) {
                toast({
                    title: "Başarılı",
                    description: result.message,
                    className: "bg-emerald-500 border-none text-white",
                });
                router.push("/admin/events");
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

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/events">
                    <Button variant="outline" size="icon" type="button">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-white">Yeni Etkinlik Oluştur</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2 bg-slate-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Etkinlik Detayları</CardTitle>
                        <CardDescription className="text-slate-400">
                            Yeni bir etkinlik oluşturmak için aşağıdaki formu doldurun.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-slate-300">Etkinlik Adı</Label>
                            <Input name="title" id="title" placeholder="Örn: GranFondo Yalova 2026" className="bg-slate-950 border-white/10 text-white" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date" className="text-slate-300">Tarih</Label>
                                <Input name="date" id="date" type="date" className="bg-slate-950 border-white/10 text-white" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location" className="text-slate-300">Konum</Label>
                                <Input name="location" id="location" placeholder="Örn: Yalova Cumhuriyet Meydanı" className="bg-slate-950 border-white/10 text-white" required />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-slate-300">Açıklama</Label>
                            <Textarea
                                name="description"
                                id="description"
                                placeholder="Etkinlik hakkında detaylı bilgi..."
                                className="min-h-[150px] bg-slate-950 border-white/10 text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/admin/events">
                                <Button variant="ghost" type="button" className="text-slate-400 hover:text-white hover:bg-white/10">İptal</Button>
                            </Link>
                            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? "Kaydediliyor..." : "Kaydet ve Yayınla"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
