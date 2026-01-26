import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getEvents, getActiveEvent } from "@/app/actions";
import { Calendar, MapPin, Users, ArrowRight, Star, Waves, Bike, Footprints } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { THEME_PRESETS } from "@/lib/theme-presets";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200";

export default async function EtkinliklerPage() {
    const events = await getEvents();
    const activeEvent = await getActiveEvent();

    // Diğer yayınlanmış etkinlikler (aktif etkinlik hariç)
    const otherEvents = events.filter(e => 
        e.status === "published" && 
        e.id !== activeEvent?.id
    );

    // Tema rengini al
    const getEventTheme = (preset?: string) => {
        const key = (preset || 'emerald') as keyof typeof THEME_PRESETS;
        return THEME_PRESETS[key] || THEME_PRESETS.emerald;
    };

    // Etkinlik için ikon seç
    const getEventIcon = (title: string, preset?: string) => {
        if (preset === 'blue' || title.toLowerCase().includes('yüzme')) {
            return <Waves className="h-5 w-5" />;
        }
        if (preset === 'orange' || title.toLowerCase().includes('koşu')) {
            return <Footprints className="h-5 w-5" />;
        }
        return <Bike className="h-5 w-5" />;
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar activeEvent={activeEvent} />

            <div className="flex-1 pt-28 pb-16">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Etkinlikler
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            {activeEvent?.site_title || 'Sporla Yalova'}&apos;nın yaklaşan ve aktif etkinliklerini keşfedin.
                        </p>
                    </div>

                    {/* Active Event - Main Feature */}
                    {activeEvent && (
                        <div className="mb-16">
                            <div className="flex items-center gap-2 mb-6">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                <h2 className="text-2xl font-bold">Ana Etkinlik</h2>
                            </div>

                            <Link href="/parkur" className="block group">
                                <div 
                                    className="relative rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${getEventTheme(activeEvent.theme_preset).primary}15, rgba(15, 23, 42, 0.9))`,
                                        borderColor: `${getEventTheme(activeEvent.theme_preset).primary}50`,
                                        borderWidth: '1px'
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-20"
                                        style={{ backgroundImage: `url(${activeEvent.background_image_url || FALLBACK_IMAGE})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/50" />

                                    <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <div 
                                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
                                                style={{
                                                    backgroundColor: `${getEventTheme(activeEvent.theme_preset).primary}20`,
                                                    color: getEventTheme(activeEvent.theme_preset).primary,
                                                    borderColor: `${getEventTheme(activeEvent.theme_preset).primary}30`,
                                                    borderWidth: '1px'
                                                }}
                                            >
                                                <Calendar className="h-4 w-4" />
                                                {new Date(activeEvent.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>

                                            <h3 className="text-3xl md:text-4xl font-bold mb-4 transition-colors" style={{ color: getEventTheme(activeEvent.theme_preset).primary }}>
                                                {activeEvent.title}
                                            </h3>

                                            <p className="text-slate-300 mb-6">
                                                {activeEvent.description || activeEvent.hero_subtitle || 'Bu etkinlik hakkında detaylı bilgi için parkurları inceleyin.'}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" style={{ color: getEventTheme(activeEvent.theme_preset).primary }} />
                                                    <span>{activeEvent.location}</span>
                                                </div>
                                                {activeEvent.participants > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" style={{ color: getEventTheme(activeEvent.theme_preset).primary }} />
                                                        <span>{activeEvent.participants} katılımcı</span>
                                                    </div>
                                                )}
                                            </div>

                                            <Button 
                                                className="text-white transition-transform hover:scale-105"
                                                style={{ 
                                                    background: `linear-gradient(135deg, ${getEventTheme(activeEvent.theme_preset).primary}, ${getEventTheme(activeEvent.theme_preset).secondary})`
                                                }}
                                            >
                                                Parkurları İncele <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="hidden md:flex justify-center">
                                            <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                                <div 
                                                    className="text-6xl font-bold mb-2"
                                                    style={{ color: getEventTheme(activeEvent.theme_preset).primary }}
                                                >
                                                    {getEventIcon(activeEvent.title, activeEvent.theme_preset)}
                                                </div>
                                                <div className="text-slate-400 mt-4">{activeEvent.site_subtitle || 'Eşsiz Deneyim'}</div>
                                                {activeEvent.short_price && activeEvent.long_price && (
                                                    <div className="mt-4 space-y-2 text-sm">
                                                        <div className="text-slate-300">🏔️ Uzun Parkur: {activeEvent.long_price} TL</div>
                                                        <div className="text-slate-300">🌊 Kısa Parkur: {activeEvent.short_price} TL</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Other Events - Grid of Cards */}
                    {otherEvents.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Diğer Etkinlikler</h2>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {otherEvents.map((event) => {
                                    const theme = getEventTheme(event.theme_preset);
                                    return (
                                        <div
                                            key={event.id}
                                            className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-white/20 transition-all"
                                        >
                                            <div 
                                                className="h-40 relative"
                                                style={{
                                                    background: `linear-gradient(135deg, ${theme.primary}30, rgba(15, 23, 42, 0.9))`
                                                }}
                                            >
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center opacity-30"
                                                    style={{ backgroundImage: `url(${event.photo_url || FALLBACK_IMAGE})` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                                                <div 
                                                    className="absolute top-4 left-4 p-2 rounded-lg"
                                                    style={{ backgroundColor: `${theme.primary}20` }}
                                                >
                                                    <span style={{ color: theme.primary }}>
                                                        {getEventIcon(event.title, event.theme_preset)}
                                                    </span>
                                                </div>

                                                <div className="absolute top-4 right-4 bg-slate-800/80 text-slate-300 px-3 py-1 rounded-full text-sm">
                                                    {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 
                                                    className="text-lg font-bold mb-3 group-hover:opacity-80 transition-opacity"
                                                    style={{ color: theme.primary }}
                                                >
                                                    {event.title}
                                                </h3>

                                                <div className="space-y-2 text-slate-400 text-sm mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                </div>

                                                {event.applications_open ? (
                                                    <span 
                                                        className="text-xs px-2 py-1 rounded-full"
                                                        style={{ 
                                                            backgroundColor: `${theme.primary}20`,
                                                            color: theme.primary
                                                        }}
                                                    >
                                                        Kayıtlar Açık
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">
                                                        Kayıt yakında açılacak
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {otherEvents.length === 0 && !activeEvent && (
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg">Henüz etkinlik bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer activeEvent={activeEvent} />
        </main>
    );
}
