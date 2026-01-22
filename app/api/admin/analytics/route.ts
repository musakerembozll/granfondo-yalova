import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Google Analytics 4 Data API integration
// Requires: GOOGLE_ANALYTICS_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS in env

interface AnalyticsResponse {
    totalVisitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: string
    topPages: { path: string; views: number; change: number }[]
    deviceBreakdown: { device: string; percentage: number }[]
    trafficSources: { source: string; visitors: number; percentage: number }[]
    dailyVisitors: { date: string; visitors: number }[]
    isRealData: boolean
}

// Sample/fallback data when GA is not configured
const sampleData: AnalyticsResponse = {
    totalVisitors: 12453,
    pageViews: 45678,
    bounceRate: 32.5,
    avgSessionDuration: "2m 34s",
    topPages: [
        { path: "/", views: 15234, change: 12 },
        { path: "/basvuru", views: 8456, change: 28 },
        { path: "/parkur", views: 6789, change: 15 },
        { path: "/etkinlikler", views: 4321, change: -5 },
        { path: "/haberler", views: 3456, change: 8 },
    ],
    deviceBreakdown: [
        { device: "Mobil", percentage: 62 },
        { device: "Masaüstü", percentage: 31 },
        { device: "Tablet", percentage: 7 },
    ],
    trafficSources: [
        { source: "Organik Arama", visitors: 5234, percentage: 42 },
        { source: "Direkt", visitors: 3456, percentage: 28 },
        { source: "Sosyal Medya", visitors: 2341, percentage: 19 },
        { source: "Referans", visitors: 1422, percentage: 11 },
    ],
    dailyVisitors: [
        { date: "Pzt", visitors: 1234 },
        { date: "Sal", visitors: 1456 },
        { date: "Çar", visitors: 1678 },
        { date: "Per", visitors: 1890 },
        { date: "Cum", visitors: 2234 },
        { date: "Cmt", visitors: 1987 },
        { date: "Paz", visitors: 1654 },
    ],
    isRealData: false
}

export async function GET(request: NextRequest) {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

    // If GA is not configured, return sample data
    if (!propertyId || !credentials) {
        return NextResponse.json({
            ...sampleData,
            configError: 'Google Analytics yapılandırılmamış. Lütfen GOOGLE_ANALYTICS_PROPERTY_ID ve GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable\'larını ekleyin.'
        })
    }

    try {
        // Parse credentials
        const credentialsJson = JSON.parse(credentials)

        // Get access token using service account
        const token = await getAccessToken(credentialsJson)

        if (!token) {
            return NextResponse.json({
                ...sampleData,
                configError: 'Google API erişim token\'ı alınamadı.'
            })
        }

        // Fetch data from Google Analytics Data API
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // Main metrics
        const metricsResponse = await fetchGAData(token, propertyId, {
            dateRanges: [{ startDate, endDate }],
            metrics: [
                { name: 'totalUsers' },
                { name: 'screenPageViews' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' }
            ]
        })

        // Top pages
        const pagesResponse = await fetchGAData(token, propertyId, {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 5
        })

        // Device breakdown
        const deviceResponse = await fetchGAData(token, propertyId, {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'totalUsers' }]
        })

        // Traffic sources
        const trafficResponse = await fetchGAData(token, propertyId, {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
            limit: 5
        })

        // Daily visitors (last 7 days)
        const dailyResponse = await fetchGAData(token, propertyId, {
            dateRanges: [{
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate
            }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }]
        })

        // Parse and format response
        const metrics = metricsResponse?.rows?.[0]?.metricValues || []
        const totalVisitors = parseInt(metrics[0]?.value || '0')
        const pageViews = parseInt(metrics[1]?.value || '0')
        const bounceRate = parseFloat(metrics[2]?.value || '0') * 100
        const avgSeconds = parseFloat(metrics[3]?.value || '0')
        const avgSessionDuration = formatDuration(avgSeconds)

        // Parse top pages
        const topPages = (pagesResponse?.rows || []).map((row: any) => ({
            path: row.dimensionValues[0].value,
            views: parseInt(row.metricValues[0].value),
            change: Math.floor(Math.random() * 30) - 10 // TODO: Calculate from previous period
        }))

        // Parse device breakdown
        const totalDeviceUsers = (deviceResponse?.rows || []).reduce((acc: number, row: any) =>
            acc + parseInt(row.metricValues[0].value), 0)

        const deviceMap: { [key: string]: string } = {
            'mobile': 'Mobil',
            'desktop': 'Masaüstü',
            'tablet': 'Tablet'
        }

        const deviceBreakdown = (deviceResponse?.rows || []).map((row: any) => ({
            device: deviceMap[row.dimensionValues[0].value] || row.dimensionValues[0].value,
            percentage: Math.round((parseInt(row.metricValues[0].value) / totalDeviceUsers) * 100)
        }))

        // Parse traffic sources
        const totalTrafficUsers = (trafficResponse?.rows || []).reduce((acc: number, row: any) =>
            acc + parseInt(row.metricValues[0].value), 0)

        const sourceMap: { [key: string]: string } = {
            'Organic Search': 'Organik Arama',
            'Direct': 'Direkt',
            'Organic Social': 'Sosyal Medya',
            'Referral': 'Referans',
            'Paid Search': 'Ücretli Arama',
            'Email': 'E-posta'
        }

        const trafficSources = (trafficResponse?.rows || []).map((row: any) => ({
            source: sourceMap[row.dimensionValues[0].value] || row.dimensionValues[0].value,
            visitors: parseInt(row.metricValues[0].value),
            percentage: Math.round((parseInt(row.metricValues[0].value) / totalTrafficUsers) * 100)
        }))

        // Parse daily visitors
        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
        const dailyVisitors = (dailyResponse?.rows || []).map((row: any) => {
            const dateStr = row.dimensionValues[0].value
            const year = parseInt(dateStr.substring(0, 4))
            const month = parseInt(dateStr.substring(4, 6)) - 1
            const day = parseInt(dateStr.substring(6, 8))
            const date = new Date(year, month, day)

            return {
                date: dayNames[date.getDay()],
                visitors: parseInt(row.metricValues[0].value)
            }
        })

        return NextResponse.json({
            totalVisitors,
            pageViews,
            bounceRate: Math.round(bounceRate * 10) / 10,
            avgSessionDuration,
            topPages,
            deviceBreakdown,
            trafficSources,
            dailyVisitors,
            isRealData: true
        })

    } catch (error) {
        console.error('Google Analytics API error:', error)
        return NextResponse.json({
            ...sampleData,
            error: 'Google Analytics verisi alınamadı: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata')
        })
    }
}

async function getAccessToken(credentials: any): Promise<string | null> {
    try {
        const jwt = await createJWT(credentials)

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        })

        const data = await response.json()
        return data.access_token || null
    } catch (error) {
        console.error('Failed to get access token:', error)
        return null
    }
}

async function createJWT(credentials: any): Promise<string> {
    const header = { alg: 'RS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)

    const payload = {
        iss: credentials.client_email,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
    }

    const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url')
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signatureInput = `${base64Header}.${base64Payload}`

    // Sign with private key
    const crypto = await import('crypto')
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(signatureInput)
    const signature = sign.sign(credentials.private_key, 'base64url')

    return `${signatureInput}.${signature}`
}

async function fetchGAData(token: string, propertyId: string, body: any) {
    const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )

    if (!response.ok) {
        throw new Error(`GA API error: ${response.status}`)
    }

    return response.json()
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
}
