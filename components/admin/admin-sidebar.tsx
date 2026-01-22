"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Calendar, Users, LogOut, Bike, BookOpen, Home, Building2, Settings, MessageSquare, Image, HelpCircle, MessageCircle, Layout, Newspaper, BarChart3, Mail, QrCode, Send, Trophy, Menu, X, UserCircle, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logoutAdmin, AdminUser } from "@/app/admin/auth-actions"
import { SettingsModal } from "@/components/admin/settings-modal"

interface AdminSidebarProps {
    user?: AdminUser | null
}

const allNavItems = [
    {
        path: "/admin",
        name: "Dashboard",
        icon: LayoutDashboard,
        adminOnly: true,
    },
    {
        path: "/admin/analytics",
        name: "Analytics",
        icon: BarChart3,
        adminOnly: true,
    },
    {
        path: "/admin/events",
        name: "Etkinlikler",
        icon: Calendar,
        adminOnly: true,
    },
    {
        path: "/admin/applications",
        name: "Başvurular",
        icon: Users,
        adminOnly: false,
    },
    {
        path: "/admin/users",
        name: "Kullanıcılar",
        icon: UserCircle,
        adminOnly: true,
    },
    {
        path: "/admin/participant-cards",
        name: "Katılımcı Kartları",
        icon: QrCode,
        adminOnly: true,
    },
    {
        path: "/admin/results",
        name: "Sonuçlar",
        icon: Trophy,
        adminOnly: true,
    },
    {
        path: "/admin/messages",
        name: "Mesajlar",
        icon: MessageSquare,
        adminOnly: false,
    },
    {
        path: "/admin/bulk-email",
        name: "Toplu Email",
        icon: Send,
        adminOnly: true,
    },
    // Content Management
    {
        path: "/admin/content",
        name: "İçerik Yönetimi",
        icon: Edit2,
        adminOnly: true,
    },
    {
        path: "/admin/gallery",
        name: "Galeri",
        icon: Image,
        adminOnly: true,
    },
    {
        path: "/admin/faq",
        name: "SSS",
        icon: HelpCircle,
        adminOnly: true,
    },
    {
        path: "/admin/testimonials",
        name: "Yorumlar",
        icon: MessageCircle,
        adminOnly: true,
    },
    {
        path: "/admin/sections",
        name: "Bölümler",
        icon: Layout,
        adminOnly: true,
    },
    {
        path: "/admin/news",
        name: "Haberler",
        icon: Newspaper,
        adminOnly: true,
    },
    // System
    {
        path: "/admin/sponsors",
        name: "Sponsorlar",
        icon: Building2,
        adminOnly: true,
    },
    {
        path: "/admin/email-templates",
        name: "Email Şablonları",
        icon: Mail,
        adminOnly: true,
    },
    {
        path: "/admin/site-settings",
        name: "Site Ayarları",
        icon: Settings,
        adminOnly: true,
    },
    {
        path: "/admin/guide",
        name: "Kılavuz",
        icon: BookOpen,
        adminOnly: false,
    },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname()
    const isAdmin = user?.role === 'admin'
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Filter nav items based on role
    const navItems = allNavItems.filter(item => !item.adminOnly || isAdmin)

    const NavContent = () => (
        <>
            <nav className="flex flex-1 flex-col gap-1.5 p-4 mt-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="relative group"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors",
                                isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
                            )}>
                                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-emerald-400")} />
                                <span className="font-medium text-sm">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistem</div>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5">
                        <Home className="h-4 w-4" /> Siteye Git
                    </Button>
                </Link>
                {isAdmin && <SettingsModal />}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={async () => {
                        await logoutAdmin()
                    }}
                >
                    <LogOut className="h-4 w-4" /> Çıkış Yap
                </Button>
            </div>
        </>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-900/50 backdrop-blur-xl lg:flex">
                <div className="flex h-16 items-center px-6 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3 font-bold text-lg tracking-wide text-white">
                        <div className="bg-emerald-500/20 p-2 rounded-lg">
                            <Bike className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <span className="block">{isAdmin ? 'Super Admin' : 'Moderatör'}</span>
                            {user?.name && (
                                <span className="text-xs text-slate-400 font-normal">{user.name}</span>
                            )}
                        </div>
                    </Link>
                </div>
                <NavContent />
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between h-14 px-4">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
                        <Bike className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm">Admin Panel</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-white"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Slide-out Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="lg:hidden fixed top-14 left-0 bottom-0 w-72 z-50 bg-slate-900 border-r border-white/10 flex flex-col"
                    >
                        <div className="px-4 py-3 border-b border-white/10">
                            <div className="text-sm text-slate-400">Hoş geldiniz,</div>
                            <div className="font-semibold text-white">{user?.name || (isAdmin ? 'Super Admin' : 'Moderatör')}</div>
                        </div>
                        <NavContent />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    )
}
