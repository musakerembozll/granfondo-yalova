import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = 'force-dynamic'

export async function GET() {
    const { data: activeEvent, error } = await supabase
        .from('events')
        .select('*')
        .eq('active_event', true)
        .single()

    const { data: allEvents } = await supabase
        .from('events')
        .select('id, title, active_event, theme_preset, site_title')

    return NextResponse.json({
        activeEvent,
        error: error?.message,
        allEvents,
        timestamp: new Date().toISOString()
    })
}
