import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function GuidePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Kullanım Kılavuzu</h1>
                <p className="text-slate-400">Yönetim panelini nasıl kullanacağınıza dair ipuçları.</p>
            </div>

            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Sıkça Sorulan Sorular</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-slate-200">Etkinlik nasıl eklerim?</AccordionTrigger>
                            <AccordionContent className="text-slate-400">
                                Sol menüden <strong>Etkinlikler</strong> sayfasına gidin. Sağ üstteki &quot;Yeni Ekle&quot; butonuna tıklayarak etkinlik detaylarını (İsim, Tarih, Konum) girip kaydedin. Oluşturulan etkinlik anında &quot;Etkinlik Listesi&quot;nde görünür ve yayına alınır.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-slate-200">Başvuruları nasıl yönetirim?</AccordionTrigger>
                            <AccordionContent className="text-slate-400">
                                <strong>Başvurular</strong> menüsünden gelen tüm kayıtları görebilirsiniz. Şu an için başvurular otomatik olarak sisteme düşer. Detaylı inceleme ve onay işlemleri için &quot;Durum&quot; sütununu kullanabilirsiniz (Gelecek güncellemede eklenecek).
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-slate-200">Sitedeki görselleri nereden değiştirebilirim?</AccordionTrigger>
                            <AccordionContent className="text-slate-400">
                                Şu an için Landing Page (Ana Sayfa) üzerindeki görseller ve metinler yazılım ekibi tarafından kod üzerinden yönetilmektedir. İlerleyen fazlarda &quot;İçerik Yönetimi&quot; modülü eklendiğinde buradan değiştirebileceksiniz.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-slate-200">Yedekleme yapmam gerekiyor mu?</AccordionTrigger>
                            <AccordionContent className="text-slate-400">
                                Sistem şu an demo modunda çalışmaktadır. Veriler geçici bir veritabanında tutulur. Canlı sisteme geçildiğinde otomatik günlük yedekleme aktif olacaktır.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
