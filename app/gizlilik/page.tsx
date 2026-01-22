import { Metadata } from "next"
import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
    title: "Gizlilik Politikası ve KVKK - GranFondo Yalova",
    description: "GranFondo Yalova kişisel verilerin korunması ve gizlilik politikası hakkında bilgi"
}

export default function GizlilikPage() {
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
                        <Shield className="h-8 w-8 text-emerald-400" />
                        <h1 className="text-3xl font-bold text-white">Gizlilik Politikası ve KVKK</h1>
                    </div>
                    <p className="text-slate-400 mt-2">Son güncelleme: 20 Ocak 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto prose prose-invert prose-emerald">

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">1. Veri Sorumlusu</h2>
                        <p className="text-slate-300">
                            GranFondo Yalova etkinliği kapsamında toplanan kişisel verileriniz, 6698 sayılı Kişisel Verilerin
                            Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla <strong>GranFondo Yalova Organizasyon Komitesi</strong>
                            tarafından işlenmektedir.
                        </p>
                        <p className="text-slate-400 text-sm mt-2">
                            İletişim: info@granfondoyalova.com
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">2. Toplanan Kişisel Veriler</h2>
                        <p className="text-slate-300 mb-3">
                            Etkinliğe kayıt olurken aşağıdaki kişisel verilerinizi topluyoruz:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Kimlik bilgileri (ad, soyad)</li>
                            <li>İletişim bilgileri (e-posta, telefon numarası)</li>
                            <li>Demografik bilgiler (cinsiyet, doğum tarihi)</li>
                            <li>Bisiklet kulübü bilgisi (isteğe bağlı)</li>
                            <li>Acil durum iletişim bilgileri</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">3. Verilerin İşlenme Amaçları</h2>
                        <p className="text-slate-300 mb-3">
                            Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Etkinlik kaydınızın oluşturulması ve yönetilmesi</li>
                            <li>Başvuru durumunuz hakkında bilgilendirme</li>
                            <li>Etkinlik ile ilgili duyuru ve bildirimlerin gönderilmesi</li>
                            <li>Acil durumlarda iletişim sağlanması</li>
                            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">4. Verilerin Aktarımı</h2>
                        <p className="text-slate-300">
                            Kişisel verileriniz, etkinliğin organizasyonu için gerekli olan üçüncü taraflara (sigorta şirketleri,
                            zamanlama hizmeti sağlayıcıları vb.) aktarılabilir. Verileriniz yurt dışına aktarılmamaktadır.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">5. Verilerin Saklanma Süresi</h2>
                        <p className="text-slate-300">
                            Kişisel verileriniz, etkinlik tarihinden itibaren 2 yıl süreyle saklanır. Bu süre sonunda
                            verileriniz silinir veya anonimleştirilir.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">6. KVKK Kapsamındaki Haklarınız</h2>
                        <p className="text-slate-300 mb-3">
                            KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                            <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                            <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                            <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                        </ul>
                        <p className="text-slate-400 text-sm mt-4">
                            Bu haklarınızı kullanmak için <a href="mailto:info@granfondoyalova.com" className="text-emerald-400 hover:underline">info@granfondoyalova.com</a> adresine başvurabilirsiniz.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">7. Çerezler (Cookies)</h2>
                        <p className="text-slate-300">
                            Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerezler, oturum
                            yönetimi ve tercihlerinizin hatırlanması için gereklidir. Tarayıcı ayarlarınızdan çerezleri
                            devre dışı bırakabilirsiniz.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-xl font-semibold text-white mb-4">8. Güvenlik</h2>
                        <p className="text-slate-300">
                            Kişisel verilerinizin güvenliği için teknik ve idari tedbirler almaktayız. Verileriniz şifreli
                            bağlantılar (SSL) aracılığıyla iletilmekte ve güvenli sunucularda saklanmaktadır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">9. Değişiklikler</h2>
                        <p className="text-slate-300">
                            Bu gizlilik politikası gerektiğinde güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
