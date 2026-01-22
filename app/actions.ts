"use server"

import { supabase, Application } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function submitApplication(data: unknown) {
    const typedData = data as any

    const { data: newApp, error } = await supabase
        .from('applications')
        .insert({
            full_name: typedData.fullName,
            tc_no: typedData.tcNo,
            email: typedData.email,
            phone: typedData.phone || null,
            birth_date: typedData.birthDate || null,
            gender: typedData.gender || null,
            city: typedData.city || null,
            club: typedData.club || null,
            category: typedData.category,
            emergency_name: typedData.emergencyName || null,
            emergency_phone: typedData.emergencyPhone || null,
            receipt_url: typedData.receiptUrl || null,
            user_id: typedData.userId || null,
            status: 'pending'
        })
        .select()
        .single()

    if (error) {
        console.error('Submit application error:', error)
        return { success: false, message: error.message }
    }

    // Update participant count for main event
    const { data: mainEvent } = await supabase
        .from('events')
        .select('id, participants')
        .eq('title', 'GranFondo Yalova 2026')
        .single()

    if (mainEvent) {
        await supabase
            .from('events')
            .update({ participants: (mainEvent.participants || 0) + 1 })
            .eq('id', mainEvent.id)
    }

    revalidatePath("/admin")
    revalidatePath("/admin/applications")

    return { success: true, message: "Başvurunuz başarıyla alındı." }
}

export async function createEvent(data: unknown) {
    const typedData = data as any

    const { error } = await supabase
        .from('events')
        .insert({
            title: typedData.title,
            date: typedData.date,
            location: typedData.location,
            status: 'published',
            participants: 0
        })

    if (error) {
        console.error('Create event error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/admin/events")

    return { success: true, message: "Etkinlik başarıyla oluşturuldu." }
}

export async function getEvent(id: string) {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Get event error:', error)
        return null
    }

    return data
}

export async function updateEvent(id: string, data: unknown) {
    const typedData = data as any

    const { error } = await supabase
        .from('events')
        .update({
            title: typedData.title,
            date: typedData.date,
            location: typedData.location,
            status: typedData.status || 'published'
        })
        .eq('id', id)

    if (error) {
        console.error('Update event error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/admin/events")

    return { success: true, message: "Etkinlik başarıyla güncellendi." }
}

export async function getDashboardStats() {
    const { data: applications } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: events } = await supabase
        .from('events')
        .select('*')

    const totalApplications = applications?.length || 0
    const activeEvents = events?.filter(e => e.status === 'published').length || 0
    const recentApplications = (applications || []).slice(0, 5).map(app => ({
        id: app.id,
        fullName: app.full_name,
        tcNo: app.tc_no,
        email: app.email,
        category: app.category,
        status: app.status,
        createdAt: app.created_at,
        receiptUrl: app.receipt_url
    }))

    const allApplications = (applications || []).map(app => ({
        id: app.id,
        fullName: app.full_name,
        category: app.category,
        status: app.status,
        createdAt: app.created_at
    }))

    return {
        totalApplications,
        activeEvents,
        recentApplications,
        allApplications,
        events: events || []
    }
}

export async function getApplications() {
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Get applications error:', error)
        return []
    }

    return (data || []).map(app => ({
        id: app.id,
        fullName: app.full_name,
        tcNo: app.tc_no,
        email: app.email,
        phone: app.phone,
        birthDate: app.birth_date,
        gender: app.gender,
        city: app.city,
        club: app.club,
        category: app.category,
        emergencyName: app.emergency_name,
        emergencyPhone: app.emergency_phone,
        receiptUrl: app.receipt_url,
        status: app.status,
        createdAt: app.created_at
    }))
}

export async function getEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

    if (error) {
        console.error('Get events error:', error)
        return []
    }

    return data || []
}

export async function updateApplicationStatus(id: string, status: "approved" | "rejected") {
    // First get the application details for email
    const { data: app } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single()

    if (!app) {
        return { success: false, message: 'Başvuru bulunamadı' }
    }

    // Update status
    const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Update status error:', error)
        return { success: false, message: error.message }
    }

    // Send email notification
    try {
        const { sendEmail, getApprovalEmailHtml, getRejectionEmailHtml } = await import('@/lib/email')

        const emailHtml = status === 'approved'
            ? getApprovalEmailHtml(app.full_name)
            : getRejectionEmailHtml(app.full_name)

        const subject = status === 'approved'
            ? '🎉 GranFondo Yalova - Başvurunuz Onaylandı!'
            : 'GranFondo Yalova - Başvuru Durumu'

        await sendEmail({
            to: app.email,
            subject,
            html: emailHtml
        })
    } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the status update if email fails
    }

    revalidatePath("/admin")
    revalidatePath("/admin/applications")
    return { success: true }
}

export async function deleteApplication(id: string) {
    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete application error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/admin/applications")
    return { success: true, message: "Başvuru silindi." }
}

export async function deleteEvent(id: string) {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete event error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    revalidatePath("/admin/events")
    return { success: true, message: "Etkinlik silindi." }
}

// Contact Messages
export async function submitContactMessage(data: {
    name: string
    email: string
    subject: string
    message: string
}) {
    const { error } = await supabase
        .from('contact_messages')
        .insert({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            status: 'unread'
        })

    if (error) {
        console.error('Submit contact message error:', error)
        return { success: false, message: error.message }
    }

    // Send notification email to admin
    try {
        const { sendEmail } = await import('@/lib/email')
        await sendEmail({
            to: 'info@sporlayalova.com', // Admin email
            subject: `📬 Yeni İletişim Mesajı: ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1e293b; color: #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #10b981;">📬 Yeni İletişim Mesajı</h2>
                    <p><strong>Gönderen:</strong> ${data.name}</p>
                    <p><strong>E-posta:</strong> ${data.email}</p>
                    <p><strong>Konu:</strong> ${data.subject}</p>
                    <hr style="border-color: #334155;">
                    <p><strong>Mesaj:</strong></p>
                    <p style="background: #0f172a; padding: 15px; border-radius: 8px;">${data.message}</p>
                    <hr style="border-color: #334155;">
                    <p style="color: #64748b; font-size: 12px;">Bu mesaj sporlayalova.com iletişim formundan gönderildi.</p>
                </div>
            `
        })
    } catch (emailError) {
        console.error('Contact notification email error:', emailError)
    }

    revalidatePath("/admin/messages")
    return { success: true, message: "Mesajınız başarıyla gönderildi." }
}

export async function getContactMessages(filter: 'inbox' | 'archive' | 'trash' = 'inbox') {
    let query = supabase
        .from('contact_messages')
        .select('*, replies:message_replies(*)')
        .order('created_at', { ascending: false })

    if (filter === 'inbox') {
        query = query.is('archived_at', null).is('deleted_at', null)
    } else if (filter === 'archive') {
        query = query.not('archived_at', 'is', null).is('deleted_at', null)
    } else if (filter === 'trash') {
        query = query.not('deleted_at', 'is', null)
    }

    const { data, error } = await query

    if (error) {
        console.error('Get contact messages error:', error)
        return []
    }

    return data || []
}

export async function markMessageAsRead(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id)

    if (error) {
        console.error('Mark message as read error:', error)
        return { success: false }
    }

    revalidatePath("/admin/messages")
    return { success: true }
}

export async function replyToMessage(messageId: string, replyText: string, adminName: string) {
    // Save reply to database
    const { error: replyError } = await supabase
        .from('message_replies')
        .insert({
            message_id: messageId,
            reply_text: replyText,
            admin_name: adminName
        })

    if (replyError) {
        console.error('Reply to message error:', replyError)
        return { success: false, message: replyError.message }
    }

    // Get original message for email
    const { data: message } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', messageId)
        .single()

    if (message) {
        // Send email notification to user
        try {
            const { sendEmail } = await import('@/lib/email')
            await sendEmail({
                to: message.email,
                subject: `Re: ${message.subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1e293b; color: #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #10b981;">GranFondo Yalova - Yanıt</h2>
                        <p>Merhaba ${message.name},</p>
                        <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">Mesajınız:</p>
                            <p style="color: #64748b; font-style: italic;">${message.message}</p>
                        </div>
                        <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">Yanıtımız:</p>
                            <p>${replyText}</p>
                        </div>
                        <p style="margin-top: 20px;">Saygılarımızla,<br/><strong>${adminName}</strong><br/>GranFondo Yalova Ekibi</p>
                    </div>
                `
            })
        } catch (emailError) {
            console.error('Reply email error:', emailError)
        }
    }

    // Update message status to replied
    await supabase
        .from('contact_messages')
        .update({ status: 'replied' })
        .eq('id', messageId)

    revalidatePath("/admin/messages")
    return { success: true }
}

export async function archiveMessage(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        console.error('Archive message error:', error)
        return { success: false }
    }

    revalidatePath("/admin/messages")
    return { success: true }
}

export async function unarchiveMessage(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .update({ archived_at: null })
        .eq('id', id)

    if (error) {
        console.error('Unarchive message error:', error)
        return { success: false }
    }

    revalidatePath("/admin/messages")
    return { success: true }
}

export async function moveToTrash(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        console.error('Move to trash error:', error)
        return { success: false }
    }

    revalidatePath("/admin/messages")
    return { success: true }
}

export async function restoreFromTrash(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .update({ deleted_at: null })
        .eq('id', id)

    if (error) {
        console.error('Restore from trash error:', error)
        return { success: false }
    }

    revalidatePath("/admin/messages")
    return { success: true }
}

export async function deleteContactMessage(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete contact message error:', error)
        return { success: false }
    }

    revalidatePath("/admin/messages")
    return { success: true }
}


