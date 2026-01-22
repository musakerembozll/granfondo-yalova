"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { SiteSettings } from "@/app/content-actions"

interface FaqSectionProps {
    siteSettings?: SiteSettings
}

const getDefaultFaqs = (shortPrice: number, longPrice: number) => [
    {
        question: "Kayıt nasıl yapılır?",
        answer: "Web sitemizden 'Kayıt Ol' butonuna tıklayarak başvuru formunu doldurabilirsiniz. Ardından belirtilen IBAN'a ödeme yapıp dekontunuzu yüklemeniz gerekmektedir."
    },
    {
        question: "Katılım ücreti ne kadar?",
        answer: `Kısa parkur için ${shortPrice} TL, uzun parkur için ${longPrice} TL katılım ücreti alınmaktadır. Erken kayıt döneminde indirimler uygulanabilir.`
    },
    {
        question: "Parkurlar ne kadar zor?",
        answer: "Kısa parkur (55 km) orta seviye sporcular için uygundur. Uzun parkur (98 km) deneyimli bisikletçiler için tasarlanmıştır ve zorlu tırmanışlar içerir."
    },
    {
        question: "Yaş sınırı var mı?",
        answer: "18 yaş üzeri herkes katılabilir. 18 yaş altı katılımcılar için veli izni gerekmektedir."
    },
    {
        question: "Bisiklet türü önemli mi?",
        answer: "Yol bisikleti (road bike) önerilir, ancak gravel ve cyclocross bisikletler de kullanılabilir. Dağ bisikleti önerilmez."
    },
    {
        question: "Parkur üzerinde ikmal noktaları var mı?",
        answer: "Evet, her 20 km'de bir ikmal noktası bulunmaktadır. Su, meyve ve enerji barları temin edilecektir."
    },
    {
        question: "Kayıt iptali yapabilir miyim?",
        answer: "Etkinlikten 30 gün önce iptal edilirse %50, 15 gün önce iptal edilirse %25 iade yapılır. Son 15 gün içinde iade yapılmaz."
    },
    {
        question: "Konaklama öneriniz var mı?",
        answer: "Yalova'da birçok otel seçeneği bulunmaktadır. Partner otellerimizde indirimli konaklama için bizimle iletişime geçebilirsiniz."
    }
]

export function FaqSection({ siteSettings }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const faqs = getDefaultFaqs(siteSettings?.short_price || 500, siteSettings?.long_price || 750)

    return (
        <section className="py-24 bg-slate-900">
            <div className="container px-4 mx-auto max-w-4xl">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
                        Merak Edilenler
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Sıkça Sorulan Sorular
                    </h2>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-medium text-white pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 text-emerald-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-5 pb-5 text-slate-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
