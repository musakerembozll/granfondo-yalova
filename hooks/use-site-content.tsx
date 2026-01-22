"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface SiteContent {
    id?: string
    key: string
    section: string
    content_type: string
    content: string
}

export interface SiteImage {
    id?: string
    key: string
    url: string
    alt_text: string
}

const defaultContent: Record<string, string> = {
    // Hero Section
    hero_title: "Zirvelere Doğru Pedalla",
    hero_subtitle: "12 Eylül 2026'da Yalova'nın eşsiz doğasında unutulmaz bir bisiklet deneyimi için hazır mısınız?",
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

const defaultImages: Record<string, string> = {
    logo: "/logo.png",
    favicon: "/favicon.png",
    hero_video: "https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4",
    hero_image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop",
    og_image: "/og-image.jpg",
}

export function useSiteContent() {
    const [content, setContent] = useState<Record<string, string>>(defaultContent)
    const [images, setImages] = useState<Record<string, string>>(defaultImages)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchContent = useCallback(async () => {
        try {
            // Fetch text content
            const { data: contentData } = await supabase
                .from("site_content")
                .select("*")

            if (contentData && contentData.length > 0) {
                const contentMap: Record<string, string> = { ...defaultContent }
                contentData.forEach((item: SiteContent) => {
                    contentMap[item.key] = item.content
                })
                setContent(contentMap)
            }

            // Fetch images
            const { data: imageData } = await supabase
                .from("site_images")
                .select("*")

            if (imageData && imageData.length > 0) {
                const imageMap: Record<string, string> = { ...defaultImages }
                imageData.forEach((item: SiteImage) => {
                    if (item.url) {
                        imageMap[item.key] = item.url
                    }
                })
                setImages(imageMap)
            }
        } catch (err) {
            console.error("Error fetching site content:", err)
            setError("İçerik yüklenirken hata oluştu")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchContent()
    }, [fetchContent])

    const updateContent = async (key: string, value: string, section: string = "general") => {
        try {
            await supabase
                .from("site_content")
                .upsert({
                    key,
                    content: value,
                    section,
                    content_type: "text",
                    updated_at: new Date().toISOString()
                }, { onConflict: "key" })

            setContent(prev => ({ ...prev, [key]: value }))
            return { success: true }
        } catch (err) {
            console.error("Error updating content:", err)
            return { success: false, error: err }
        }
    }

    const updateImage = async (key: string, url: string, altText: string = "") => {
        try {
            await supabase
                .from("site_images")
                .upsert({
                    key,
                    url,
                    alt_text: altText || key.replace(/_/g, " ")
                }, { onConflict: "key" })

            setImages(prev => ({ ...prev, [key]: url }))
            return { success: true }
        } catch (err) {
            console.error("Error updating image:", err)
            return { success: false, error: err }
        }
    }

    return {
        content,
        images,
        loading,
        error,
        updateContent,
        updateImage,
        refetch: fetchContent
    }
}

// Default values for SSR/static generation
export { defaultContent, defaultImages }
