import { Metadata } from "next"
import Link from "next/link"
import { FileText, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
    title: "Kullanım Şartları - GranFondo Yalova",
    description: "GranFondo Yalova web sitesi kullanım şartları ve koşulları"
}

export default function KullanimSartlariPage() {
    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/10">
                <div className="container mx-auto px-4 py-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ana Sayfa
                    </Link>
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-emerald-400" />
                        <h1 className="text-3xl font-bold text-white">Kullanım Şartları</h1>
                    </div>
                    <p className="text-slate-400 mt-2">Son güncelleme: 20 Ocak 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto prose prose-invert prose-emerald">

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">1. Genel Hükümler</h2>
                        <p className="text-slate-300">
                            Bu web sitesini ("Site") kullanarak, aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.
                            Bu şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">2. Etkinlik Kaydı ve Başvuru</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Etkinliğe katılım için online başvuru yapmanız gerekmektedir</li>
                            <li>Başvuru sırasında verilen bilgilerin doğruluğundan siz sorumlusunuz</li>
                            <li>Yanlış veya eksik bilgi verilmesi durumunda başvurunuz reddedilebilir</li>
                            <li>Başvuru ücreti iade edilmez (iptal durumları hariç)</li>
                            <li>Organizasyon, başvuruları onaylama veya reddetme hakkını saklı tutar</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">3. Katılımcı Sorumlulukları</h2>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Etkinliğe katılım için 18 yaşından büyük olmanız veya veli izni almanız gerekmektedir</li>
                            <li>Kendi sağlık durumunuzun etkinliğe uygun olduğundan emin olmalısınız</li>
                            <li>Etkinlik kurallarına ve organizasyon talimatlarına uymalısınız</li>
                            <li>Trafik kurallarına ve güvenlik önlemlerine riayet etmelisiniz</li>
                            <li>Bisikletinizin sürüşe uygun ve bakımlı olması sizin sorumluluğunuzdadır</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">4. Sorumluluk Reddi</h2>
                        <p className="text-slate-300">
                            Etkinlik sırasında meydana gelebilecek kaza, yaralanma veya maddi hasar durumlarında
                            organizasyon komitesi sorumlu tutulamaz. Katılımcılar, etkinliğe katılarak bu riski
                            kabul etmiş sayılırlar.
                        </p>
                        <p className="text-slate-300 mt-3">
                            Organizasyon, hava koşulları veya mücbir sebepler nedeniyle etkinliği erteleme veya
                            iptal etme hakkını saklı tutar.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">5. Fotoğraf ve Video Kullanımı</h2>
                        <p className="text-slate-300">
                            Etkinlik sırasında çekilen fotoğraf ve videolar, tanıtım ve sosyal medya amaçlı
                            kullanılabilir. Etkinliğe katılarak, bu kullanıma onay vermiş sayılırsınız.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">6. Fikri Mülkiyet</h2>
                        <p className="text-slate-300">
                            Bu sitedeki tüm içerik, logo, tasarım ve materyaller GranFondo Yalova'ya aittir.
                            İzinsiz kullanım yasaktır.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">7. Uyuşmazlık Çözümü</h2>
                        <p className="text-slate-300">
                            Bu şartlardan doğan uyuşmazlıklarda Yalova Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">8. İletişim</h2>
                        <p className="text-slate-300">
                            Sorularınız için <a href="mailto:info@granfondoyalova.com" className="text-emerald-400 hover:underline">info@granfondoyalova.com</a> adresinden
                            bize ulaşabilirsiniz.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
