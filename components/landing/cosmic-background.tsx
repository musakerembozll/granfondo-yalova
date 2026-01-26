"use client"

import { useEffect, useRef, useCallback } from "react"

interface Star {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  opacity: number
  pulseSpeed: number
  pulsePhase: number
  color: string
}

interface Orb {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  speed: number
  angle: number
}

const COLORS = {
  primary: "16, 185, 129",    // emerald
  secondary: "20, 184, 166",  // teal
  accent: "6, 182, 212",      // cyan
  purple: "139, 92, 246",     // violet
  blue: "59, 130, 246",       // blue
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const starsRef = useRef<Star[]>([])
  const orbsRef = useRef<Orb[]>([])
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  const initializeElements = useCallback((width: number, height: number) => {
    // Create stars
    const starCount = Math.floor((width * height) / 15000)
    starsRef.current = Array.from({ length: starCount }, () => {
      const x = Math.random() * width
      const y = Math.random() * height
      const colorKeys = Object.keys(COLORS) as (keyof typeof COLORS)[]
      const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)]
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: COLORS[colorKey]
      }
    })

    // Create floating orbs (large gradient circles)
    orbsRef.current = [
      { x: width * 0.2, y: height * 0.3, radius: 300, color: COLORS.primary, opacity: 0.03, speed: 0.0003, angle: 0 },
      { x: width * 0.8, y: height * 0.6, radius: 400, color: COLORS.purple, opacity: 0.025, speed: 0.0004, angle: Math.PI },
      { x: width * 0.5, y: height * 0.8, radius: 350, color: COLORS.accent, opacity: 0.02, speed: 0.00035, angle: Math.PI / 2 },
    ]
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeElements(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      timeRef.current += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw floating orbs with gradient
      orbsRef.current.forEach(orb => {
        orb.angle += orb.speed
        const offsetX = Math.sin(orb.angle) * 50
        const offsetY = Math.cos(orb.angle * 0.7) * 30

        const gradient = ctx.createRadialGradient(
          orb.x + offsetX, orb.y + offsetY, 0,
          orb.x + offsetX, orb.y + offsetY, orb.radius
        )
        gradient.addColorStop(0, `rgba(${orb.color}, ${orb.opacity})`)
        gradient.addColorStop(0.5, `rgba(${orb.color}, ${orb.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${orb.color}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x + offsetX, orb.y + offsetY, orb.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      const mouse = mouseRef.current
      const connectionDistance = 150
      const mouseInfluence = 200

      // Update and draw stars
      starsRef.current.forEach((star, i) => {
        // Pulse animation
        const pulse = Math.sin(timeRef.current * star.pulseSpeed + star.pulsePhase)
        const currentOpacity = star.opacity + pulse * 0.15
        const currentSize = star.size + pulse * 0.5

        // Mouse interaction - stars gently drift away
        const dx = mouse.x - star.x
        const dy = mouse.y - star.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouseInfluence && dist > 0) {
          const force = (mouseInfluence - dist) / mouseInfluence
          star.x = star.baseX - (dx / dist) * force * 30
          star.y = star.baseY - (dy / dist) * force * 30
        } else {
          // Slowly return to base position
          star.x += (star.baseX - star.x) * 0.02
          star.y += (star.baseY - star.y) * 0.02
        }

        // Draw glow
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, currentSize * 4
        )
        glowGradient.addColorStop(0, `rgba(${star.color}, ${currentOpacity * 0.8})`)
        glowGradient.addColorStop(0.5, `rgba(${star.color}, ${currentOpacity * 0.2})`)
        glowGradient.addColorStop(1, `rgba(${star.color}, 0)`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, currentSize * 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw star core
        ctx.fillStyle = `rgba(${star.color}, ${currentOpacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections to nearby stars (constellation effect)
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const otherStar = starsRef.current[j]
          const connDx = otherStar.x - star.x
          const connDy = otherStar.y - star.y
          const connDist = Math.sqrt(connDx * connDx + connDy * connDy)

          if (connDist < connectionDistance) {
            const lineOpacity = (1 - connDist / connectionDistance) * 0.15
            ctx.strokeStyle = `rgba(${star.color}, ${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(otherStar.x, otherStar.y)
            ctx.stroke()
          }
        }

        // Draw connection to mouse if close
        if (dist < connectionDistance * 1.5) {
          const lineOpacity = (1 - dist / (connectionDistance * 1.5)) * 0.3
          ctx.strokeStyle = `rgba(${star.color}, ${lineOpacity})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(star.x, star.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      })

      // Draw mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 100
        )
        mouseGlow.addColorStop(0, `rgba(${COLORS.primary}, 0.1)`)
        mouseGlow.addColorStop(0.5, `rgba(${COLORS.accent}, 0.05)`)
        mouseGlow.addColorStop(1, `rgba(${COLORS.primary}, 0)`)

        ctx.fillStyle = mouseGlow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeElements])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  )
}
