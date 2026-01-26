// Theme presets for different events
// Each preset defines primary, secondary and accent colors

export const THEME_PRESETS = {
  emerald: {
    name: 'Yeşil (Bisiklet)',
    primary: '#10b981',
    secondary: '#14b8a6', 
    accent: '#06b6d4',
    gradient: 'from-emerald-500 to-teal-500',
    hoverGradient: 'from-emerald-600 to-teal-600',
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-emerald-400',
    textHover: 'hover:text-emerald-400',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500',
    shadow: 'shadow-emerald-500/20',
    // Tailwind classes
    classes: {
      button: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
      buttonSecondary: 'border-emerald-500/30 hover:border-emerald-500/50',
      heading: 'text-emerald-400',
      icon: 'text-emerald-400',
      badge: 'bg-emerald-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.emerald.500)]',
    }
  },
  blue: {
    name: 'Mavi (Yüzme)',
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#8b5cf6',
    gradient: 'from-blue-500 to-indigo-500',
    hoverGradient: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    text: 'text-blue-400',
    textHover: 'hover:text-blue-400',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
    shadow: 'shadow-blue-500/20',
    classes: {
      button: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
      buttonSecondary: 'border-blue-500/30 hover:border-blue-500/50',
      heading: 'text-blue-400',
      icon: 'text-blue-400',
      badge: 'bg-blue-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.blue.500)]',
    }
  },
  orange: {
    name: 'Turuncu (Koşu)',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#fbbf24',
    gradient: 'from-orange-500 to-amber-500',
    hoverGradient: 'from-orange-600 to-amber-600',
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    text: 'text-orange-400',
    textHover: 'hover:text-orange-400',
    border: 'border-orange-500',
    ring: 'ring-orange-500',
    shadow: 'shadow-orange-500/20',
    classes: {
      button: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
      buttonSecondary: 'border-orange-500/30 hover:border-orange-500/50',
      heading: 'text-orange-400',
      icon: 'text-orange-400',
      badge: 'bg-orange-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.orange.500)]',
    }
  },
  red: {
    name: 'Kırmızı',
    primary: '#ef4444',
    secondary: '#f87171',
    accent: '#fca5a5',
    gradient: 'from-red-500 to-rose-500',
    hoverGradient: 'from-red-600 to-rose-600',
    bg: 'bg-red-500',
    bgHover: 'hover:bg-red-600',
    text: 'text-red-400',
    textHover: 'hover:text-red-400',
    border: 'border-red-500',
    ring: 'ring-red-500',
    shadow: 'shadow-red-500/20',
    classes: {
      button: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
      buttonSecondary: 'border-red-500/30 hover:border-red-500/50',
      heading: 'text-red-400',
      icon: 'text-red-400',
      badge: 'bg-red-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.red.500)]',
    }
  },
  purple: {
    name: 'Mor',
    primary: '#a855f7',
    secondary: '#c084fc',
    accent: '#d8b4fe',
    gradient: 'from-purple-500 to-violet-500',
    hoverGradient: 'from-purple-600 to-violet-600',
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    text: 'text-purple-400',
    textHover: 'hover:text-purple-400',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
    shadow: 'shadow-purple-500/20',
    classes: {
      button: 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600',
      buttonSecondary: 'border-purple-500/30 hover:border-purple-500/50',
      heading: 'text-purple-400',
      icon: 'text-purple-400',
      badge: 'bg-purple-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.purple.500)]',
    }
  },
  cyan: {
    name: 'Camgöbeği',
    primary: '#06b6d4',
    secondary: '#22d3ee',
    accent: '#67e8f9',
    gradient: 'from-cyan-500 to-sky-500',
    hoverGradient: 'from-cyan-600 to-sky-600',
    bg: 'bg-cyan-500',
    bgHover: 'hover:bg-cyan-600',
    text: 'text-cyan-400',
    textHover: 'hover:text-cyan-400',
    border: 'border-cyan-500',
    ring: 'ring-cyan-500',
    shadow: 'shadow-cyan-500/20',
    classes: {
      button: 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600',
      buttonSecondary: 'border-cyan-500/30 hover:border-cyan-500/50',
      heading: 'text-cyan-400',
      icon: 'text-cyan-400',
      badge: 'bg-cyan-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.cyan.500)]',
    }
  },
  rose: {
    name: 'Pembe',
    primary: '#f43f5e',
    secondary: '#fb7185',
    accent: '#fda4af',
    gradient: 'from-rose-500 to-pink-500',
    hoverGradient: 'from-rose-600 to-pink-600',
    bg: 'bg-rose-500',
    bgHover: 'hover:bg-rose-600',
    text: 'text-rose-400',
    textHover: 'hover:text-rose-400',
    border: 'border-rose-500',
    ring: 'ring-rose-500',
    shadow: 'shadow-rose-500/20',
    classes: {
      button: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
      buttonSecondary: 'border-rose-500/30 hover:border-rose-500/50',
      heading: 'text-rose-400',
      icon: 'text-rose-400',
      badge: 'bg-rose-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.rose.500)]',
    }
  },
  amber: {
    name: 'Altın',
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#fcd34d',
    gradient: 'from-amber-500 to-yellow-500',
    hoverGradient: 'from-amber-600 to-yellow-600',
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    text: 'text-amber-400',
    textHover: 'hover:text-amber-400',
    border: 'border-amber-500',
    ring: 'ring-amber-500',
    shadow: 'shadow-amber-500/20',
    classes: {
      button: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
      buttonSecondary: 'border-amber-500/30 hover:border-amber-500/50',
      heading: 'text-amber-400',
      icon: 'text-amber-400',
      badge: 'bg-amber-500',
      glow: 'shadow-[0_0_40px_-5px_theme(colors.amber.500)]',
    }
  }
} as const

export type ThemePreset = keyof typeof THEME_PRESETS
export type ThemePresetValue = (typeof THEME_PRESETS)[ThemePreset]

export function getThemePreset(preset: string | null | undefined): ThemePresetValue {
  const key = preset as ThemePreset
  if (key && THEME_PRESETS[key]) {
    return THEME_PRESETS[key]
  }
  return THEME_PRESETS.emerald
}
