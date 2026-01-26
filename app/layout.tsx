import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { CookieConsent } from "@/components/cookie-consent";
import { supabase } from "@/lib/supabase";
import { Analytics } from '@vercel/analytics/next';
import { CosmicBackgroundWrapper } from '@/components/landing/cosmic-background-wrapper';

const inter = Inter({ subsets: ["latin"] });

// Dynamic metadata based on active event
export async function generateMetadata(): Promise<Metadata> {
  // Fetch active event
  const { data: activeEvent } = await supabase
    .from('events')
    .select('*')
    .eq('active_event', true)
    .single()

  const isSwimming = activeEvent?.title?.toLowerCase().includes('yüzme') || 
                     activeEvent?.title?.toLowerCase().includes('swimming')
  
  const siteTitle = activeEvent?.site_title || (isSwimming ? 'Yalova Açık Su Yüzme 2025' : 'GranFondo Yalova 2026')
  const siteSubtitle = activeEvent?.site_subtitle || (isSwimming ? "Yalova'nın İlk Açık Su Yüzme Yarışı" : "Türkiye'nin En Prestijli Bisiklet Yarışı")
  const eventDate = activeEvent?.date || '2026-04-14'
  const faviconUrl = activeEvent?.favicon_url || '/favicon.ico'

  return {
    title: {
      default: `${siteTitle} | ${siteSubtitle}`,
      template: `%s | ${siteTitle}`
    },
    description: `${eventDate} Yalova - ${siteTitle}. ${isSwimming ? 'Açık su yüzme yarışı' : 'GranFondo bisiklet yarışı'}. Hemen kayıt ol!`,
    keywords: isSwimming 
      ? ["yüzme", "yalova", "açık su yüzme", "swimming", "open water", "spor", "türkiye", "2025"]
      : ["granfondo", "yalova", "bisiklet yarışı", "cycling", "gran fondo", "bisiklet", "spor", "türkiye", "2026"],
    authors: [{ name: siteTitle }],
    creator: siteTitle,
    publisher: siteTitle,
    metadataBase: new URL("https://www.sporlayalova.com"),
    alternates: {
      canonical: "./"
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: "https://www.sporlayalova.com",
      siteName: siteTitle,
      title: `${siteTitle} | ${siteSubtitle}`,
      description: `${eventDate} Yalova - ${siteTitle}. ${isSwimming ? 'Açık su yüzme yarışı' : 'GranFondo bisiklet yarışı'}.`,
      images: [
        {
          url: activeEvent?.hero_image_url || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: siteTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: `${eventDate}'da Yalova'da düzenlenecek ${isSwimming ? 'açık su yüzme yarışına' : 'GranFondo bisiklet yarışına'} katılın.`,
      images: [activeEvent?.hero_image_url || "/og-image.jpg"]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    verification: {
      // Google Search Console doğrulama kodu eklenebilir
      // google: "your-google-verification-code"
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased`}>
        <CosmicBackgroundWrapper />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}