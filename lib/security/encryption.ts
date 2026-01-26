/**
 * Encryption utilities for sensitive data (TC Kimlik No, etc.)
 * Uses AES-256-GCM for encryption at rest
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 16

// Get encryption key from environment variable
function getEncryptionKey(): Buffer {
    const secret = process.env.ENCRYPTION_SECRET
    if (!secret) {
        console.warn('[Security] ENCRYPTION_SECRET not set - using fallback (NOT SECURE FOR PRODUCTION)')
        // In development, use a fallback - but log warning
        return scryptSync('dev-fallback-key-not-secure', 'salt', KEY_LENGTH)
    }
    // Derive a proper key from the secret using scrypt
    return scryptSync(secret, 'granfondo-salt', KEY_LENGTH)
}

/**
 * Encrypts a string value using AES-256-GCM
 * Returns base64 encoded string: salt:iv:authTag:encrypted
 */
export function encrypt(plainText: string): string {
    const key = getEncryptionKey()
    const iv = randomBytes(IV_LENGTH)
    
    const cipher = createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    // Combine iv + authTag + encrypted data
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

/**
 * Decrypts a value encrypted with encrypt()
 * Input format: iv:authTag:encrypted (all hex encoded)
 */
export function decrypt(encryptedText: string): string {
    try {
        const key = getEncryptionKey()
        const parts = encryptedText.split(':')
        
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted format')
        }
        
        const iv = Buffer.from(parts[0], 'hex')
        const authTag = Buffer.from(parts[1], 'hex')
        const encrypted = parts[2]
        
        const decipher = createDecipheriv(ALGORITHM, key, iv)
        decipher.setAuthTag(authTag)
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        
        return decrypted
    } catch (error) {
        console.error('[Security] Decryption error:', error)
        throw new Error('Decryption failed')
    }
}

/**
 * Checks if a string looks like an encrypted value
 */
export function isEncrypted(value: string): boolean {
    // Encrypted format: iv:authTag:encrypted (hex values separated by colons)
    const parts = value.split(':')
    if (parts.length !== 3) return false
    
    // Check if all parts are valid hex
    return parts.every(part => /^[0-9a-f]+$/i.test(part))
}

/**
 * Masks a TC Kimlik number for display (shows only last 4 digits)
 */
export function maskTcNo(tcNo: string): string {
    if (!tcNo || tcNo.length < 4) return '***'
    return '*'.repeat(tcNo.length - 4) + tcNo.slice(-4)
}

/**
 * Validates TC Kimlik number format
 */
export function isValidTcNo(tcNo: string): boolean {
    // Must be 11 digits, first digit cannot be 0
    return /^[1-9]\d{10}$/.test(tcNo)
}
