"use client"

import { useState, useEffect, useRef } from 'react'

interface UseCountAnimationOptions {
    start?: number
    end: number
    duration?: number
    delay?: number
    suffix?: string
    prefix?: string
}

export function useCountAnimation({
    start = 0,
    end,
    duration = 2000,
    delay = 0,
    suffix = '',
    prefix = ''
}: UseCountAnimationOptions) {
    const [count, setCount] = useState(start)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [isVisible])

    useEffect(() => {
        if (!isVisible) return

        const startTime = Date.now() + delay
        const diff = end - start

        const animate = () => {
            const now = Date.now()
            const elapsed = now - startTime

            if (elapsed < 0) {
                requestAnimationFrame(animate)
                return
            }

            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(start + diff * eased)

            setCount(current)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [isVisible, start, end, duration, delay])

    const displayValue = `${prefix}${count}${suffix}`

    return { ref, displayValue, count, isVisible }
}

// Component version for easier use
interface AnimatedCounterProps {
    value: number
    suffix?: string
    prefix?: string
    duration?: number
    delay?: number
    className?: string
}

export function AnimatedCounter({
    value,
    suffix = '',
    prefix = '',
    duration = 2000,
    delay = 0,
    className = ''
}: AnimatedCounterProps) {
    const { ref, displayValue } = useCountAnimation({
        end: value,
        suffix,
        prefix,
        duration,
        delay
    })

    return (
        <div ref={ref} className={className}>
            {displayValue}
        </div>
    )
}
