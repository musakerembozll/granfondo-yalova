"use client"

import { createContext, useContext, ReactNode } from 'react'
import { THEME_PRESETS, ThemePreset, ThemePresetValue, getThemePreset } from '@/lib/theme-presets'

type ThemeContextType = {
  preset: ThemePreset
  theme: ThemePresetValue
}

const ThemeContext = createContext<ThemeContextType>({
  preset: 'emerald',
  theme: THEME_PRESETS.emerald
})

export function ThemeProvider({ 
  children, 
  preset = 'emerald' 
}: { 
  children: ReactNode
  preset?: string 
}) {
  const theme = getThemePreset(preset)
  const validPreset = (preset in THEME_PRESETS ? preset : 'emerald') as ThemePreset

  return (
    <ThemeContext.Provider value={{ preset: validPreset, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
