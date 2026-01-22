'use server'

import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

export interface EmailTemplate {
  id: string
  template_key: string
  name: string
  subject: string
  html_body: string
  variables: string[]
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Get all email templates from database
 */
export async function getEmailTemplates() {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })

    if (error) throw error

    return { success: true, data: data as EmailTemplate[] }
  } catch (error: any) {
    console.error('Error fetching email templates:', error)
    return { success: false, error: error.message, data: [] }
  }
}

/**
 * Get a single email template by key
 */
export async function getEmailTemplate(templateKey: string) {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single()

    if (error) throw error

    return { success: true, data: data as EmailTemplate }
  } catch (error: any) {
    console.error(`Error fetching template ${templateKey}:`, error)
    return { success: false, error: error.message, data: null }
  }
}

/**
 * Update an email template
 */
export async function updateEmailTemplate(
  templateKey: string,
  updates: { subject?: string; html_body?: string }
) {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('template_key', templateKey)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as EmailTemplate }
  } catch (error: any) {
    console.error(`Error updating template ${templateKey}:`, error)
    return { success: false, error: error.message, data: null }
  }
}

/**
 * Replace template variables with actual values
 */
function replaceTemplateVariables(
  html: string,
  variables: Record<string, string>
): string {
  let result = html

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(regex, value || '')
  })

  return result
}

/**
 * Send email using a template
 */
export async function sendEmailWithTemplate(
  templateKey: string,
  to: string,
  variables: Record<string, string>
) {
  try {
    // Fetch template
    const templateResult = await getEmailTemplate(templateKey)

    if (!templateResult.success || !templateResult.data) {
      throw new Error(`Template not found: ${templateKey}`)
    }

    const template = templateResult.data

    // Replace variables in subject and body
    const subject = replaceTemplateVariables(template.subject, variables)
    const html = replaceTemplateVariables(template.html_body, variables)

    // Send email
    const emailResult = await sendEmail({ to, subject, html })

    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Email sending failed')
    }

    return { success: true, message: 'Email sent successfully' }
  } catch (error: any) {
    console.error('Error sending email with template:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get template HTML with variables replaced (for preview)
 */
export async function getTemplatePreview(
  templateKey: string,
  variables: Record<string, string>
) {
  try {
    const templateResult = await getEmailTemplate(templateKey)

    if (!templateResult.success || !templateResult.data) {
      throw new Error(`Template not found: ${templateKey}`)
    }

    const template = templateResult.data
    const html = replaceTemplateVariables(template.html_body, variables)

    return { success: true, html }
  } catch (error: any) {
    console.error('Error generating preview:', error)
    return { success: false, error: error.message, html: '' }
  }
}
