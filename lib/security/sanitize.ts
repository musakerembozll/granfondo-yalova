/**
 * Server-safe HTML sanitization utilities to prevent XSS attacks
 *
 * NOTE: This is a simplified sanitizer for server-side use.
 * For rich HTML content, consider using a proper HTML parser.
 */

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
 * Sanitize user input text (removes all HTML)
 * Use for plain text fields like names, addresses, etc.
 */
export function sanitizeText(text: string): string {
    // Remove all HTML tags
    return text.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize HTML content for email templates
 * This is a basic implementation that strips dangerous tags
 * while preserving safe formatting tags
 */
export function sanitizeEmailHTML(html: string): string {
    // For now, we'll use a simple approach:
    // 1. Remove script tags and their content
    // 2. Remove event handlers (onclick, onload, etc.)
    // 3. Remove dangerous tags (iframe, object, embed, etc.)

    let sanitized = html

    // Remove script tags and content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // Remove event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')

    // Remove dangerous tags
    const dangerousTags = ['iframe', 'object', 'embed', 'applet', 'link', 'style', 'meta', 'base']
    dangerousTags.forEach(tag => {
        const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi')
        sanitized = sanitized.replace(regex, '')
        // Also remove self-closing tags
        const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi')
        sanitized = sanitized.replace(selfClosing, '')
    })

    // Remove javascript: and data: protocols
    sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
    sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')
    sanitized = sanitized.replace(/href\s*=\s*["']?\s*data:/gi, 'href="#"')
    sanitized = sanitized.replace(/src\s*=\s*["']?\s*data:/gi, 'src=""')

    return sanitized
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
        // Escape the value to prevent injection
        const escapedValue = escapeHTML(value)
        result = result.replace(placeholder, escapedValue)
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
