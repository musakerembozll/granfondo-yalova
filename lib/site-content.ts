import { supabase } from "@/lib/supabase"

export interface SiteContent {
    [key: string]: string
}

export interface SiteImages {
    [key: string]: string
}

// Default content values
export const defaultContent: SiteContent = {
    // Hero Section
    hero_title: "GRAN FONDO YALOVA 2026",
    hero_subtitle: "Marmara'nın incisinde, eşsiz doğa ve zorlu parkurlarda pedallamaya hazır mısın? Sınırlarını zorla, efsaneye ortak ol.",
    hero_cta: "Hemen Başvur",

    // About Section
    about_title: "Hakkında",
    about_subtitle: "GranFondo Yalova Nedir?",
    about_description: "GranFondo Yalova, Türkiye'nin en prestijli bisiklet etkinliklerinden biridir. Her yıl binlerce bisiklet tutkunu, Yalova'nın muhteşem doğasında bir araya gelir.",

    // Features
    feature_1_title: "98 KM Uzun Parkur",
    feature_1_desc: "Deneyimli bisikletçiler için zorlu ve heyecan verici parkur",
    feature_2_title: "55 KM Kısa Parkur",
    feature_2_desc: "Her seviyeden bisikletçi için ideal başlangıç parkuru",
    feature_3_title: "Profesyonel Organizasyon",
    feature_3_desc: "Güvenli ve profesyonel etkinlik deneyimi",

    // CTA Section
    cta_title: "Yarışa Katılmaya Hazır mısın?",
    cta_subtitle: "Hemen başvur ve bu benzersiz deneyimin parçası ol!",
    cta_button: "Başvuru Yap",

    // Stats
    stat_1_value: "2000+",
    stat_1_label: "Katılımcı",
    stat_2_value: "15+",
    stat_2_label: "Yıllık Deneyim",
    stat_3_value: "98",
    stat_3_label: "Km Parkur",
}

export const defaultImages: SiteImages = {
    logo: "/logo.png",
    favicon: "/favicon.png",
    hero_video: "https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4",
    hero_image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
    og_image: "/og-image.jpg",
}

export async function getSiteContent(): Promise<SiteContent> {
    try {
        const { data, error } = await supabase
            .from("site_content")
            .select("key, content")

        if (error || !data) {
            return defaultContent
        }

        const contentMap: SiteContent = { ...defaultContent }
        data.forEach((item: { key: string; content: string }) => {
            if (item.content) {
                contentMap[item.key] = item.content
            }
        })

        return contentMap
    } catch (error) {
        console.error("Error fetching site content:", error)
        return defaultContent
    }
}

export async function getSiteImages(): Promise<SiteImages> {
    try {
        const { data, error } = await supabase
            .from("site_images")
            .select("key, url")

        if (error || !data) {
            return defaultImages
        }

        const imageMap: SiteImages = { ...defaultImages }
        data.forEach((item: { key: string; url: string }) => {
            if (item.url) {
                imageMap[item.key] = item.url
            }
        })

        return imageMap
    } catch (error) {
        console.error("Error fetching site images:", error)
        return defaultImages
    }
}

export async function getSiteData() {
    const [content, images] = await Promise.all([
        getSiteContent(),
        getSiteImages()
    ])

    return { content, images }
}
