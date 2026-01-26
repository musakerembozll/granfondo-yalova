import { getSectionSettings, getHeroContent } from "@/app/content-actions"
import { VisualPageBuilder } from "@/components/admin/visual-page-builder"
import { supabase } from "@/lib/supabase"

async function getSectionOrder() {
    const { data } = await supabase
        .from('section_settings')
        .select('section_order')
        .eq('id', 'main')
        .single()
    
    return data?.section_order || []
}

async function getSectionContent() {
    const heroContent = await getHeroContent()
    
    const content: Record<string, Record<string, string>> = {}
    
    if (heroContent) {
        content.hero = {
            title: heroContent.title || '',
            subtitle: heroContent.subtitle || '',
            buttonText: heroContent.button_text || '',
            backgroundUrl: heroContent.background_url || ''
        }
    }
    
    return content
}

export default async function SectionsPage() {
    const [settings, order, content] = await Promise.all([
        getSectionSettings(),
        getSectionOrder(),
        getSectionContent()
    ])

    return (
        <div className="h-[calc(100vh-100px)]">
            <VisualPageBuilder 
                initialSettings={settings} 
                initialOrder={order}
                initialContent={content}
            />
        </div>
    )
}
