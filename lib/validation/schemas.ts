import { z } from 'zod'

/**
 * TC Kimlik No validation algorithm
 */
function validateTCNo(tcNo: string): boolean {
    if (tcNo.length !== 11) return false
    if (!/^\d{11}$/.test(tcNo)) return false
    if (tcNo[0] === '0') return false

    const digits = tcNo.split('').map(Number)

    // Calculate 10th digit
    const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7]
    const digit10 = (sum1 - sum2) % 10

    if (digits[9] !== digit10) return false

    // Calculate 11th digit
    const sum3 = digits.slice(0, 10).reduce((a, b) => a + b, 0)
    const digit11 = sum3 % 10

    if (digits[10] !== digit11) return false

    return true
}

/**
 * Application submission schema
 */
export const ApplicationSchema = z.object({
    fullName: z.string()
        .min(2, 'Ad Soyad en az 2 karakter olmalıdır')
        .max(100, 'Ad Soyad en fazla 100 karakter olabilir')
        .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad Soyad sadece harf içerebilir'),

    tcNo: z.string()
        .length(11, 'TC Kimlik No 11 haneli olmalıdır')
        .regex(/^\d{11}$/, 'TC Kimlik No sadece rakam içermelidir')
        .refine(validateTCNo, 'Geçersiz TC Kimlik No'),

    email: z.string()
        .email('Geçersiz email adresi')
        .max(255, 'Email adresi çok uzun'),

    phone: z.string()
        .regex(/^(\+90|0)?[0-9]{10}$/, 'Geçersiz telefon numarası (örn: 5551234567 veya +905551234567)')
        .optional()
        .or(z.literal('')),

    birthDate: z.string()
        .optional()
        .or(z.literal('')),

    gender: z.enum(['male', 'female'])
        .optional()
        .or(z.literal('') as any),

    city: z.string()
        .max(100, 'Şehir adı çok uzun')
        .optional()
        .or(z.literal('')),

    club: z.string()
        .max(100, 'Kulüp adı çok uzun')
        .optional()
        .or(z.literal('')),

    category: z.enum(['long', 'short'], {
        message: 'Geçerli bir kategori seçiniz'
    }),

    emergencyName: z.string()
        .max(100, 'Acil durum kişisi adı çok uzun')
        .optional()
        .or(z.literal('')),

    emergencyPhone: z.string()
        .regex(/^(\+90|0)?[0-9]{10}$/, 'Geçersiz acil durum telefon numarası')
        .optional()
        .or(z.literal('')),

    receiptUrl: z.string()
        .url('Geçersiz dosya URL\'si')
        .optional()
        .or(z.literal('')),

    userId: z.string()
        .uuid('Geçersiz kullanıcı ID')
        .optional()
        .or(z.literal(''))
})

export type ApplicationInput = z.infer<typeof ApplicationSchema>

/**
 * Contact message schema
 */
export const ContactMessageSchema = z.object({
    name: z.string()
        .min(2, 'İsim en az 2 karakter olmalıdır')
        .max(100, 'İsim en fazla 100 karakter olabilir')
        .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içerebilir'),

    email: z.string()
        .email('Geçersiz email adresi')
        .max(255, 'Email adresi çok uzun'),

    subject: z.string()
        .min(5, 'Konu en az 5 karakter olmalıdır')
        .max(200, 'Konu en fazla 200 karakter olabilir'),

    message: z.string()
        .min(10, 'Mesaj en az 10 karakter olmalıdır')
        .max(2000, 'Mesaj en fazla 2000 karakter olabilir')
})

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>

/**
 * Event creation/update schema
 */
export const EventSchema = z.object({
    title: z.string()
        .min(3, 'Başlık en az 3 karakter olmalıdır')
        .max(200, 'Başlık en fazla 200 karakter olabilir'),

    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Geçersiz tarih formatı (YYYY-MM-DD)'),

    location: z.string()
        .min(2, 'Konum en az 2 karakter olmalıdır')
        .max(200, 'Konum en fazla 200 karakter olabilir'),

    status: z.enum(['published', 'draft'])
        .optional()
        .default('published')
})

export type EventInput = z.infer<typeof EventSchema>

/**
 * Admin login schema
 */
export const AdminLoginSchema = z.object({
    username: z.string()
        .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
        .max(50, 'Kullanıcı adı en fazla 50 karakter olabilir')
        .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),

    password: z.string()
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .max(100, 'Şifre çok uzun')
})

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>

/**
 * Email template schema
 */
export const EmailTemplateSchema = z.object({
    key: z.string()
        .min(1, 'Template key gereklidir')
        .max(100, 'Template key çok uzun'),

    subject: z.string()
        .min(1, 'Konu gereklidir')
        .max(200, 'Konu çok uzun'),

    html_body: z.string()
        .min(1, 'HTML içerik gereklidir')
        .max(50000, 'HTML içerik çok uzun'),

    variables: z.array(z.string())
        .optional()
})

export type EmailTemplateInput = z.infer<typeof EmailTemplateSchema>
