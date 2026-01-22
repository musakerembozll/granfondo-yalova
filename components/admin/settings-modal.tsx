"use client"

import { useState, useEffect } from "react"
import { Settings, Check, Palette, Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"

const themeColors = [
    { name: "Zümrüt", value: "emerald", primary: "#10b981", secondary: "#059669" },
    { name: "Mavi", value: "blue", primary: "#3b82f6", secondary: "#2563eb" },
    { name: "Mor", value: "purple", primary: "#8b5cf6", secondary: "#7c3aed" },
    { name: "Turuncu", value: "orange", primary: "#f97316", secondary: "#ea580c" },
    { name: "Pembe", value: "pink", primary: "#ec4899", secondary: "#db2777" },
    { name: "Kırmızı", value: "red", primary: "#ef4444", secondary: "#dc2626" },
    { name: "Sarı", value: "yellow", primary: "#eab308", secondary: "#ca8a04" },
    { name: "Cyan", value: "cyan", primary: "#06b6d4", secondary: "#0891b2" },
]

interface AdminSettings {
    theme: string
    notifications: boolean
    compactMode: boolean
}

const defaultSettings: AdminSettings = {
    theme: "emerald",
    notifications: true,
    compactMode: false
}

export function SettingsModal() {
    const [settings, setSettings] = useState<AdminSettings>(defaultSettings)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = () => {
        try {
            const saved = localStorage.getItem("adminSettings")
            if (saved) {
                const parsed = JSON.parse(saved)
                setSettings(parsed)
                applyTheme(parsed.theme)
            } else {
                applyTheme(defaultSettings.theme)
            }
        } catch (e) {
            applyTheme(defaultSettings.theme)
        }
    }

    const saveSettings = (newSettings: AdminSettings) => {
        setSettings(newSettings)
        localStorage.setItem("adminSettings", JSON.stringify(newSettings))
    }

    const applyTheme = (theme: string) => {
        const themeData = themeColors.find(t => t.value === theme)
        if (!themeData) return

        const root = document.documentElement

        // Apply CSS variables for the theme
        root.style.setProperty("--theme-primary", themeData.primary)
        root.style.setProperty("--theme-secondary", themeData.secondary)
        root.style.setProperty("--theme-primary-10", themeData.primary + "1a") // 10% opacity
        root.style.setProperty("--theme-primary-20", themeData.primary + "33") // 20% opacity

        // Apply theme class for Tailwind
        document.body.setAttribute("data-theme", theme)

        // Apply theme colors to elements with dynamic classes
        const style = document.createElement('style')
        style.id = 'admin-theme-styles'

        // Remove old style if exists
        const oldStyle = document.getElementById('admin-theme-styles')
        if (oldStyle) oldStyle.remove()

        style.textContent = `
            /* Theme-aware colors */
            .theme-primary { color: ${themeData.primary} !important; }
            .theme-bg-primary { background-color: ${themeData.primary} !important; }
            .theme-bg-primary-10 { background-color: ${themeData.primary}1a !important; }
            .theme-bg-primary-20 { background-color: ${themeData.primary}33 !important; }
            .theme-border-primary { border-color: ${themeData.primary}50 !important; }
            .hover\\:theme-bg-primary:hover { background-color: ${themeData.secondary} !important; }
            
            /* Override emerald colors with theme */
            .bg-emerald-500 { background-color: ${themeData.primary} !important; }
            .bg-emerald-500\\/10 { background-color: ${themeData.primary}1a !important; }
            .bg-emerald-500\\/20 { background-color: ${themeData.primary}33 !important; }
            .text-emerald-400, .text-emerald-500 { color: ${themeData.primary} !important; }
            .border-emerald-500 { border-color: ${themeData.primary} !important; }
            .border-emerald-500\\/50 { border-color: ${themeData.primary}80 !important; }
            .from-emerald-500 { --tw-gradient-from: ${themeData.primary} !important; }
            .to-emerald-400, .to-teal-400 { --tw-gradient-to: ${themeData.secondary} !important; }
            .hover\\:bg-emerald-600:hover { background-color: ${themeData.secondary} !important; }
            .ring-emerald-500\\/20 { --tw-ring-color: ${themeData.primary}33 !important; }
        `
        document.head.appendChild(style)
    }

    const handleThemeChange = (theme: string) => {
        const newSettings = { ...settings, theme }
        saveSettings(newSettings)
        applyTheme(theme)
    }

    const handleNotificationsToggle = () => {
        const newSettings = { ...settings, notifications: !settings.notifications }
        saveSettings(newSettings)
    }

    const handleCompactModeToggle = () => {
        const newSettings = { ...settings, compactMode: !settings.compactMode }
        saveSettings(newSettings)

        // Apply compact mode
        if (newSettings.compactMode) {
            document.body.classList.add('compact-mode')
        } else {
            document.body.classList.remove('compact-mode')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5">
                    <Settings className="h-4 w-4" /> Ayarlar
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Ayarlar
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Admin paneli tercihleriniz bu tarayıcıda saklanır.
                    </DialogDescription>
                </DialogHeader>

                {/* Theme Colors */}
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Tema Rengi
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                        {themeColors.map((theme) => (
                            <button
                                key={theme.value}
                                onClick={() => handleThemeChange(theme.value)}
                                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${settings.theme === theme.value
                                    ? "border-white/30 bg-white/10"
                                    : "border-white/10 hover:border-white/20 hover:bg-white/5"
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: theme.primary }}
                                >
                                    {settings.theme === theme.value && (
                                        <Check className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <span className="text-xs text-slate-300">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/10">
                        <div className="flex items-center gap-3">
                            <Bell className="h-4 w-4 text-slate-400" />
                            <div>
                                <div className="text-sm text-white">Bildirimler</div>
                                <div className="text-xs text-slate-500">Tarayıcı bildirimleri</div>
                            </div>
                        </div>
                        <Switch
                            checked={settings.notifications}
                            onCheckedChange={handleNotificationsToggle}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/10">
                        <div className="flex items-center gap-3">
                            <Moon className="h-4 w-4 text-slate-400" />
                            <div>
                                <div className="text-sm text-white">Kompakt Mod</div>
                                <div className="text-xs text-slate-500">Daha yoğun arayüz</div>
                            </div>
                        </div>
                        <Switch
                            checked={settings.compactMode}
                            onCheckedChange={handleCompactModeToggle}
                        />
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 text-center">
                        ✨ Ayarlar otomatik olarak kaydedilir ve sadece bu tarayıcıda saklanır.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Hook to initialize theme on mount
export function useAdminTheme() {
    useEffect(() => {
        try {
            const saved = localStorage.getItem("adminSettings")
            if (saved) {
                const settings = JSON.parse(saved)
                const themeData = themeColors.find(t => t.value === settings.theme)
                if (themeData) {
                    const root = document.documentElement
                    root.style.setProperty("--theme-primary", themeData.primary)
                    root.style.setProperty("--theme-secondary", themeData.secondary)
                    document.body.setAttribute("data-theme", settings.theme)
                }
            }
        } catch (e) { }
    }, [])
}
