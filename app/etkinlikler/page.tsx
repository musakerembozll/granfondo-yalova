import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getEvents } from "@/app/actions";
import { Calendar, MapPin, Users, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EtkinliklerPage() {
    const events = await getEvents();

    // Ana etkinlik - GranFondo Yalova 2026
    const mainEvent = events.find(e => e.title === "GranFondo Yalova 2026");

    // Diğer etkinlikler
    const otherEvents = events.filter(e => e.status === "published" && e.title !== "GranFondo Yalova 2026");

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-28 pb-16">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Etkinlikler
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            GranFondo Yalova&apos;nın yaklaşan ve aktif etkinliklerini keşfedin.
                        </p>
                    </div>

                    {/* Main Event - GranFondo Yalova 2026 */}
                    {mainEvent && (
                        <div className="mb-16">
                            <div className="flex items-center gap-2 mb-6">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                <h2 className="text-2xl font-bold">Ana Etkinlik</h2>
                            </div>

                            <Link href="/parkur" className="block group">
                                <div className="relative bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-500/30 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200')] bg-cover bg-center opacity-20" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/50" />

                                    <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(mainEvent.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>

                                            <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                                                GranFondo Yalova 2026
                                            </h3>

                                            <p className="text-slate-300 mb-6">
                                                Türkiye&apos;nin en prestijli bisiklet festivali geri dönüyor!
                                                Uzun ve kısa parkur seçenekleriyle tüm seviyelere uygun,
                                                eşsiz doğa manzaraları eşliğinde unutulmaz bir deneyim.
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-emerald-500" />
                                                    <span>{mainEvent.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-emerald-500" />
                                                    <span>{mainEvent.participants} katılımcı</span>
                                                </div>
                                            </div>

                                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                                                Parkurları İncele <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="hidden md:flex justify-center">
                                            <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                                <div className="text-6xl font-bold text-emerald-400 mb-2">2</div>
                                                <div className="text-slate-400">Parkur Seçeneği</div>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <div className="text-slate-300">🏔️ Uzun Parkur: 98 km</div>
                                                    <div className="text-slate-300">🌊 Kısa Parkur: 55 km</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Other Events */}
                    {otherEvents.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Diğer Etkinlikler</h2>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {otherEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
                                    >
                                        <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800')] bg-cover bg-center opacity-20" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                                            <div className="absolute top-4 right-4 bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                                                {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-white mb-3">
                                                {event.title}
                                            </h3>

                                            <div className="space-y-2 text-slate-400 text-sm mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 italic">
                                                Kayıt yakında açılacak
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {otherEvents.length === 0 && !mainEvent && (
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg">Henüz etkinlik bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
