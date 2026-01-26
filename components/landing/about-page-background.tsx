"use client"

import { FloatingParticles } from "@/components/landing/floating-particles"

export function AboutPageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <FloatingParticles 
        particleCount={60}
        colors={["#10b981", "#14b8a6", "#06b6d4", "#22d3ee", "#34d399", "#818cf8", "#a78bfa"]}
      />
    </div>
  )
}
