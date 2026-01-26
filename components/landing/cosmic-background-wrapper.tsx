"use client"

import { usePathname } from "next/navigation"
import { FloatingParticles } from "./floating-particles"

// Pages where floating particles should be shown (only inner pages, not homepage)
const ALLOWED_PATHS = [
  '/hakkinda',
  '/haberler',
  '/iletisim',
  '/parkur',
  '/etkinlikler',
  '/gizlilik',
  '/kullanim-sartlari',
]

export function CosmicBackgroundWrapper() {
  const pathname = usePathname()
  
  // Don't show on admin, login, auth, profile, homepage, basvuru pages
  if (!pathname ||
      pathname === '/' ||
      pathname?.startsWith('/admin') || 
      pathname?.startsWith('/login') || 
      pathname?.startsWith('/giris') ||
      pathname?.startsWith('/kayit') ||
      pathname?.startsWith('/auth') ||
      pathname?.startsWith('/profil') ||
      pathname?.startsWith('/basvuru') ||
      pathname?.startsWith('/sifremi-unuttum')) {
    return null
  }

  // Check if current path should show the background
  const shouldShow = ALLOWED_PATHS.some(path => pathname?.startsWith(path))

  if (!shouldShow) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <FloatingParticles 
        particleCount={50}
        colors={["#10b981", "#14b8a6", "#06b6d4", "#22d3ee", "#34d399"]}
      />
    </div>
  )
}
