import { SignJWT, jwtVerify } from 'jose'

/**
 * JWT session management utilities
 */

export interface SessionPayload {
    id: string
    username: string
    role: 'admin' | 'moderator'
    name: string
    iat?: number
    exp?: number
}

const SESSION_DURATION = 7 * 24 * 60 * 60 // 7 days in seconds

/**
 * Get the secret key for JWT signing
 */
function getSecretKey(): Uint8Array {
    const secret = process.env.SESSION_SECRET

    if (!secret) {
        throw new Error('SESSION_SECRET environment variable is not set')
    }

    return new TextEncoder().encode(secret)
}

/**
 * Create a signed JWT token
 * @param payload - Session data to encode
 * @returns Signed JWT token
 */
export async function createJWT(payload: SessionPayload): Promise<string> {
    const secret = getSecretKey()

    const token = await new SignJWT({
        id: payload.id,
        username: payload.username,
        role: payload.role,
        name: payload.name
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION}s`)
        .sign(secret)

    return token
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded session payload or null if invalid
 */
export async function verifyJWT(token: string): Promise<SessionPayload | null> {
    try {
        const secret = getSecretKey()

        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS256']
        })

        return {
            id: payload.id as string,
            username: payload.username as string,
            role: payload.role as 'admin' | 'moderator',
            name: payload.name as string,
            iat: payload.iat,
            exp: payload.exp
        }
    } catch (error) {
        // Token invalid, expired, or tampered
        console.error('JWT verification failed:', error)
        return null
    }
}

/**
 * Check if a JWT token is close to expiration (within 1 day)
 * @param payload - Decoded JWT payload
 * @returns True if token should be refreshed
 */
export function shouldRefreshToken(payload: SessionPayload): boolean {
    if (!payload.exp) return false

    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - now

    // Refresh if less than 1 day remaining
    return timeUntilExpiry < 24 * 60 * 60
}
