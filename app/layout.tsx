import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GranFondo Yalova 2026 | Türkiye'nin En Prestijli Bisiklet Yarışı",
    template: "%s | GranFondo Yalova 2026"
  },
  description: "12 Eylül 2026 Yalova - GranFondo bisiklet yarışı. 98 km ve 55 km parkur seçenekleri. Hemen kayıt ol!",
  keywords: ["granfondo", "yalova", "bisiklet yarışı", "cycling", "gran fondo", "bisiklet", "spor", "türkiye", "2026"],
  authors: [{ name: "GranFondo Yalova" }],
  creator: "GranFondo Yalova",
  publisher: "GranFondo Yalova",
  metadataBase: new URL("https://www.sporlayalova.com"),
  alternates: {
    canonical: "./"
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.sporlayalova.com",
    siteName: "GranFondo Yalova 2026",
    title: "GranFondo Yalova 2026 | Türkiye'nin En Prestijli Bisiklet Yarışı",
    description: "12 Eylül 2026 Yalova - GranFondo bisiklet yarışı. 98 km ve 55 km parkur seçenekleri.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GranFondo Yalova 2026"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GranFondo Yalova 2026",
    description: "12 Eylül 2026'da Yalova'da düzenlenecek GranFondo bisiklet yarışına katılın.",
    images: ["/og-image.jpg"]
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
        <CookieConsent />
      </body>
    </html>
  );
}
