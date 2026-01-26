import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
    // İletişim bilgileri artık aktif etkinlikten geliyor
    const { data: activeEvent, error: eventError } = await supabase
        .from('events')
        .select('contact_email, contact_phone')
        .eq('is_active', true)
        .single()

    if (eventError || !activeEvent) {
        console.error('Get active event contact info API error:', eventError)
        // Return defaults
        return NextResponse.json({
            contact_email: "info@sporlayalova.com",
            contact_phone: "+90 (555) 123 45 67",
            address: "Yalova Merkez, Türkiye",
            working_hours: "Pazartesi - Cuma: 09:00 - 18:00"
        })
    }

    return NextResponse.json({
        contact_email: activeEvent.contact_email || "info@sporlayalova.com",
        contact_phone: activeEvent.contact_phone || "+90 (555) 123 45 67",
        address: "Yalova Merkez, Türkiye",
        working_hours: "Pazartesi - Cuma: 09:00 - 18:00"
    })
}
