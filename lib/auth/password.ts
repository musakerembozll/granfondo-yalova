import bcrypt from 'bcryptjs'

/**
 * Password hashing and validation utilities using bcrypt
 */

const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash using timing-safe comparison
 * @param password - Plain text password
 * @param hash - Hashed password to compare against
 * @returns True if password matches hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

/**
 * Password strength validation
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
    if (password.length < 12) {
        return {
            valid: false,
            error: 'Şifre en az 12 karakter olmalıdır'
        }
    }

    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            error: 'Şifre en az bir büyük harf içermelidir'
        }
    }

    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            error: 'Şifre en az bir küçük harf içermelidir'
        }
    }

    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            error: 'Şifre en az bir rakam içermelidir'
        }
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {
            valid: false,
            error: 'Şifre en az bir özel karakter içermelidir'
        }
    }

    return { valid: true }
}

/**
 * Generate a secure random password
 * @param length - Password length (default: 16)
 * @returns Generated password
 */
export function generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const allChars = uppercase + lowercase + numbers + special

    let password = ''

    // Ensure at least one of each required character type
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('')
}
