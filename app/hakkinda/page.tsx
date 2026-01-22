import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Trophy, Users, Calendar, Heart, Target, Mountain, Award, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HakkindaPage() {
    const stats = [
        { icon: Calendar, value: "4", label: "Yıldır Düzenleniyor" },
        { icon: Users, value: "5000+", label: "Toplam Katılımcı" },
        { icon: Trophy, value: "50+", label: "Ödül Dağıtıldı" },
        { icon: Heart, value: "100+", label: "Gönüllü" },
    ];

    const values = [
        { icon: Target, title: "Misyonumuz", description: "Bisiklet sporunu Türkiye'de yaygınlaştırmak, her yaştan ve seviyeden sporcuya erişilebilir etkinlikler sunmak." },
        { icon: Mountain, title: "Deneyim", description: "Yalova'nın eşsiz doğası, Marmara manzarası ve zorlu tırmanışlarla dolu parkurlar sizleri bekliyor." },
        { icon: Award, title: "Kalite", description: "Uluslararası standartlarda organizasyon, profesyonel zamanlama sistemi ve güvenli parkur tasarımı." },
        { icon: MapPin, title: "Konum", description: "İstanbul'a 1 saat mesafede, kolay ulaşım, zengin konaklama seçenekleri ve muhteşem doğa." },
    ];

    const team = [
        { name: "Organizasyon Komitesi", role: "Yalova Belediyesi işbirliğiyle" },
        { name: "Teknik Ekip", role: "Türkiye Bisiklet Federasyonu onaylı" },
        { name: "Sağlık Ekibi", role: "Her istasyonda ambulans ve ilk yardım" },
        { name: "Güvenlik", role: "Tüm parkur boyunca trafik kontrolü" },
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-28 pb-16">
                <div className="container px-4 mx-auto max-w-5xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Hakkımızda
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            GranFondo Yalova, 2023 yılından bu yana Türkiye&apos;nin en prestijli
                            bisiklet organizasyonlarından biri olarak yolculuğuna devam ediyor.
                        </p>
                    </div>

                    {/* Story */}
                    <div className="prose prose-invert prose-lg max-w-none mb-16">
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-emerald-400 mb-6">Hikayemiz</h2>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                GranFondo Yalova, bisiklet severlerin doğayla buluştuğu, sınırlarını zorladığı
                                ve unutulmaz anılar biriktirdiği bir platform olarak 2023 yılında hayata geçti.
                                İlk yılımızda 800 katılımcıyla başlayan serüvenimiz, her yıl büyüyerek
                                Türkiye&apos;nin en çok tercih edilen Gran Fondo etkinliklerinden biri haline geldi.
                            </p>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                Yalova&apos;nın eşsiz coğrafyası - deniz seviyesinden başlayıp 800 metreye
                                tırmanan zorlu rotaları, Marmara Denizi&apos;nin muhteşem manzarası ve yemyeşil
                                ormanlarla çevrili parkurları - her pedal darbesiyle ayrı bir deneyim sunuyor.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Amacımız sadece bir yarış düzenlemek değil; bisiklet kültürünü yaymak,
                                sporculara güvenli ve profesyonel bir ortam sunmak ve Yalova&apos;yı
                                bisiklet turizminin merkezi haline getirmektir.
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="text-center p-6 bg-slate-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
                                    <Icon className="h-8 w-8 mx-auto mb-3 text-emerald-400" />
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Values */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Değerlerimiz</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {values.map((value) => {
                                const Icon = value.icon;
                                return (
                                    <div key={value.title} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                                <Icon className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                                <p className="text-slate-400 text-sm">{value.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">Organizasyon Ekibi</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {team.map((member) => (
                                <div key={member.name} className="bg-slate-900/50 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                                    <h3 className="font-semibold text-white">{member.name}</h3>
                                    <p className="text-slate-400 text-sm">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-10">
                        <h2 className="text-2xl font-bold text-white mb-4">2026 Sezonu İçin Hazır mısın?</h2>
                        <p className="text-slate-300 mb-6">12 Eylül 2026&apos;da Yalova&apos;da buluşalım!</p>
                        <Link href="/basvuru">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                                Hemen Kayıt Ol
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
