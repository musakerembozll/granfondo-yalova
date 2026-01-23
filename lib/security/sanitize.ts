import DOMPurify from 'isomorphic-dompurify'

/**
 * HTML sanitization utilities to prevent XSS attacks
 */

/**
 * Allowed HTML tags for email templates
 */
const ALLOWED_TAGS = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'div', 'span',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
]

/**
 * Allowed HTML attributes
 */
const ALLOWED_ATTR = [
    'href', 'src', 'alt', 'title',
    'class', 'style',
    'width', 'height',
    'align', 'valign'
]

/**
 * Sanitize HTML content for email templates
 * Allows safe HTML tags while removing dangerous elements
 */
export function sanitizeEmailHTML(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false,
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    })
}

/**
 * Sanitize user input text (removes all HTML)
 * Use for plain text fields like names, addresses, etc.
 */
export function sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    })
}

/**
 * Escape HTML special characters
 * Use for displaying user input in HTML context
 */
export function escapeHTML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

/**
 * Sanitize and escape template variables
 * Replaces {{variableName}} with escaped values
 */
export function replaceTemplateVariables(
    template: string,
    variables: Record<string, string>
): string {
    let result = template

    for (const [key, value] of Object.entries(variables)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g')
        // Sanitize the value to prevent injection
        const sanitizedValue = sanitizeText(value)
        result = result.replace(placeholder, sanitizedValue)
    }

    return result
}

/**
 * Validate and sanitize URL
 * Ensures URL is safe and uses HTTPS (or HTTP for localhost in dev)
 */
export function sanitizeURL(url: string): string | null {
    try {
        const parsed = new URL(url)

        // Only allow HTTPS in production, HTTP allowed for localhost in dev
        if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
            return null
        }

        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null
        }

        // Block potentially dangerous URLs
        const dangerousPatterns = [
            'javascript:',
            'data:',
            'vbscript:',
            'file:',
            'about:'
        ]

        if (dangerousPatterns.some(pattern => url.toLowerCase().startsWith(pattern))) {
            return null
        }

        return url
    } catch {
        return null
    }
}

/**
 * Sanitize filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
    // Remove path separators and special characters
    return filename
        .replace(/[\/\\]/g, '')
        .replace(/\.\./g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255) // Limit length
}
