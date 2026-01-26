"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// ============================================
// SITE SETTINGS
// ============================================

export interface SiteSettings {
    id?: string
    event_date: string
    short_price: number
    long_price: number
    iban: string
    bank_name: string
    account_holder: string
    contact_email: string
    contact_phone: string
}

const defaultSiteSettings: SiteSettings = {
    event_date: "2026-09-12",
    short_price: 500,
    long_price: 750,
    iban: "TR12 0001 0012 3456 7890 1234 56",
    bank_name: "Ziraat Bankası",
    account_holder: "GranFondo Yalova Spor Kulübü",
    contact_email: "info@granfondoyalova.com",
    contact_phone: "+90 226 123 45 67"
}

export async function getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

    if (error || !data) {
        console.error('Get site settings error:', error)
        return defaultSiteSettings
    }
    return data
}

export async function updateSiteSettings(settings: SiteSettings) {
    const { error } = settings.id
        ? await supabase.from('site_settings').update(settings).eq('id', settings.id)
        : await supabase.from('site_settings').insert(settings)

    if (error) {
        console.error('Update site settings error:', error)
        return { success: false, message: error.message }
    }

    // Revalidate all pages that use site settings
    revalidatePath('/', 'layout')
    revalidatePath('/basvuru')
    revalidatePath('/hakkinda')
    revalidatePath('/iletisim')
    revalidatePath('/admin/site-settings')

    return { success: true }
}

// ============================================
// HERO CONTENT
// ============================================

export async function getHeroContent() {
    const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single()

    if (error) {
        console.error('Get hero content error:', error)
        return null
    }
    return data
}

export async function updateHeroContent(content: {
    title: string
    subtitle: string
    buttonText: string
    backgroundUrl?: string
}) {
    // First check if record exists
    const existing = await getHeroContent()

    if (existing) {
        const { error } = await supabase
            .from('hero_content')
            .update(content)
            .eq('id', existing.id)

        if (error) {
            console.error('Update hero content error:', error)
            return { success: false, message: error.message }
        }
    } else {
        const { error } = await supabase
            .from('hero_content')
            .insert(content)

        if (error) {
            console.error('Insert hero content error:', error)
            return { success: false, message: error.message }
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
}

// ============================================
// GALLERY
// ============================================

export async function getGalleryItems() {
    const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Get gallery items error:', error)
        return []
    }
    return data || []
}

export async function addGalleryItem(item: { url: string; caption: string }) {
    // Get max order_index
    const { data: maxItem } = await supabase
        .from('gallery_items')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

    const newIndex = (maxItem?.order_index || 0) + 1

    const { error } = await supabase
        .from('gallery_items')
        .insert({ ...item, order_index: newIndex })

    if (error) {
        console.error('Add gallery item error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/gallery")
    return { success: true }
}

export async function deleteGalleryItem(id: string) {
    const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete gallery item error:', error)
        return { success: false }
    }

    revalidatePath("/")
    revalidatePath("/admin/gallery")
    return { success: true }
}

// ============================================
// FAQ
// ============================================

export async function getFaqItems() {
    const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Get FAQ items error:', error)
        return []
    }
    return data || []
}

export async function addFaqItem(item: { question: string; answer: string }) {
    const { data: maxItem } = await supabase
        .from('faq_items')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

    const newIndex = (maxItem?.order_index || 0) + 1

    const { error } = await supabase
        .from('faq_items')
        .insert({ ...item, order_index: newIndex })

    if (error) {
        console.error('Add FAQ item error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/faq")
    return { success: true }
}

export async function updateFaqItem(id: string, item: { question: string; answer: string }) {
    const { error } = await supabase
        .from('faq_items')
        .update(item)
        .eq('id', id)

    if (error) {
        console.error('Update FAQ item error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/faq")
    return { success: true }
}

export async function deleteFaqItem(id: string) {
    const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete FAQ item error:', error)
        return { success: false }
    }

    revalidatePath("/")
    revalidatePath("/admin/faq")
    return { success: true }
}

// ============================================
// TESTIMONIALS
// ============================================

export async function getTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Get testimonials error:', error)
        return []
    }
    return data || []
}

export async function addTestimonial(item: { name: string; location: string; comment: string; rating: number; avatar_url?: string }) {
    const { error } = await supabase
        .from('testimonials')
        .insert(item)

    if (error) {
        console.error('Add testimonial error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/testimonials")
    return { success: true }
}

export async function updateTestimonial(id: string, item: { name: string; location: string; comment: string; rating: number }) {
    const { error } = await supabase
        .from('testimonials')
        .update(item)
        .eq('id', id)

    if (error) {
        console.error('Update testimonial error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/testimonials")
    return { success: true }
}

export async function deleteTestimonial(id: string) {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete testimonial error:', error)
        return { success: false }
    }

    revalidatePath("/")
    revalidatePath("/admin/testimonials")
    return { success: true }
}

// ============================================
// SECTION SETTINGS
// ============================================

export async function getSectionSettings() {
    const { data, error } = await supabase
        .from('section_settings')
        .select('*')

    if (error) {
        console.error('Get section settings error:', error)
        return {}
    }

    // Convert to key-value object
    const settings: Record<string, boolean> = {}
    data?.forEach(item => {
        settings[item.section_key] = item.is_visible
    })
    return settings
}

export async function updateSectionVisibility(sectionKey: string, isVisible: boolean) {
    // Upsert
    const { error } = await supabase
        .from('section_settings')
        .upsert({
            section_key: sectionKey,
            is_visible: isVisible
        }, {
            onConflict: 'section_key'
        })

    if (error) {
        console.error('Update section visibility error:', error)
        return { success: false }
    }

    // Aggressive cache clearing to ensure changes are visible immediately
    revalidatePath('/', 'layout')
    revalidatePath("/admin/sections")
    return { success: true }
}

// ============================================
// SPONSORS
// ============================================

export async function getSponsors() {
    const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Get sponsors error:', error)
        return []
    }
    return data || []
}

export async function addSponsor(item: { name: string; logo_url: string; website?: string }) {
    const { data: maxItem } = await supabase
        .from('sponsors')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

    const newIndex = (maxItem?.order_index || 0) + 1

    const { error } = await supabase
        .from('sponsors')
        .insert({ ...item, order_index: newIndex })

    if (error) {
        console.error('Add sponsor error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/admin/sponsors")
    return { success: true }
}

export async function deleteSponsor(id: string) {
    const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete sponsor error:', error)
        return { success: false }
    }

    revalidatePath("/")
    revalidatePath("/admin/sponsors")
    return { success: true }
}

// ============================================
// NEWS / BLOG
// ============================================

export async function getNews(limit?: number) {
    let query = supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    if (limit) {
        query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
        console.error('Get news error:', error)
        return []
    }
    return data || []
}

export async function getAllNews() {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Get all news error:', error)
        return []
    }
    return data || []
}

export async function getNewsById(id: string) {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Get news by id error:', error)
        return null
    }
    return data
}

export async function addNews(item: {
    title: string
    excerpt: string
    content: string
    image_url: string
    category: string
    read_time?: string
    is_published?: boolean
}) {
    const { error } = await supabase
        .from('news')
        .insert({
            ...item,
            published_at: item.is_published ? new Date().toISOString() : null
        })

    if (error) {
        console.error('Add news error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/haberler")
    revalidatePath("/admin/news")
    return { success: true }
}

export async function updateNews(id: string, item: {
    title: string
    excerpt: string
    content: string
    image_url: string
    category: string
    read_time?: string
    is_published?: boolean
}) {
    const { data: existing } = await supabase
        .from('news')
        .select('is_published, published_at')
        .eq('id', id)
        .single()

    // Set published_at if publishing for first time
    let published_at = existing?.published_at
    if (item.is_published && !existing?.published_at) {
        published_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('news')
        .update({ ...item, published_at })
        .eq('id', id)

    if (error) {
        console.error('Update news error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/")
    revalidatePath("/haberler")
    revalidatePath("/admin/news")
    return { success: true }
}

export async function deleteNews(id: string) {
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete news error:', error)
        return { success: false }
    }

    revalidatePath("/")
    revalidatePath("/haberler")
    revalidatePath("/admin/news")
    return { success: true }
}

export async function getNewsComments(newsId: string) {
    const { data, error } = await supabase
        .from('news_comments')
        .select('*')
        .eq('news_id', newsId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

    if (error) {
        // console.error('Get news comments error:', error)
        // Return empty array if table doesn't exist yet
        return []
    }
    return data || []
}

export async function addNewsComment(newsId: string, data: { fullName: string, email: string, content: string }) {
    const { error } = await supabase
        .from('news_comments')
        .insert({
            news_id: newsId,
            full_name: data.fullName,
            email: data.email,
            content: data.content,
            is_approved: false // Requires moderation
        })

    if (error) {
        console.error('Add news comment error:', error)
        return { success: false, message: error.message }
    }

    return { success: true }
}

// ============================================
// ABOUT PAGE CONTENT
// ============================================

export async function getAboutPageContent() {
    const { data, error } = await supabase
        .from('about_page_content')
        .select('*')

    if (error) {
        console.error('Get about page content error:', error)
        return {
            story: null,
            stats: [],
            values: [],
            team: []
        }
    }

    const result: {
        story: any
        stats: any[]
        values: any[]
        team: any[]
    } = {
        story: null,
        stats: [],
        values: [],
        team: []
    }

    data?.forEach(item => {
        if (item.content_type === 'story') {
            result.story = item.data
        } else if (item.content_type === 'stats') {
            result.stats = Array.isArray(item.data) ? item.data : []
        } else if (item.content_type === 'values') {
            result.values = Array.isArray(item.data) ? item.data : []
        } else if (item.content_type === 'team') {
            result.team = Array.isArray(item.data) ? item.data : []
        }
    })

    return result
}

export async function updateAboutPageContent(contentType: 'story' | 'stats' | 'values' | 'team', data: any) {
    const { error } = await supabase
        .from('about_page_content')
        .upsert({
            content_type: contentType,
            data: data
        }, {
            onConflict: 'content_type'
        })

    if (error) {
        console.error('Update about page content error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/hakkinda")
    revalidatePath("/admin/content")
    return { success: true }
}


