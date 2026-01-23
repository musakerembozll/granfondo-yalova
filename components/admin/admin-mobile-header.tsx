"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LayoutDashboard, Calendar, Users, LogOut, Bike, BookOpen, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/app/admin/auth-actions"

const navItems = [
    { path: "/admin", name: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/events", name: "Etkinlikler", icon: Calendar },
    { path: "/admin/applications", name: "Başvurular", icon: Users },
    { path: "/admin/guide", name: "Kılavuz", icon: BookOpen },
]

export function AdminMobileHeader() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            <header className="flex md:hidden h-16 items-center justify-between border-b border-white/10 px-6 bg-slate-900/50 backdrop-blur-md">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                        <Bike className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="font-bold text-lg">GranFondo Admin</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white"
                    aria-label="Menüyü aç/kapat"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900/95 backdrop-blur-lg border-b border-white/10 overflow-hidden"
                    >
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                )
                            })}

                            <div className="pt-4 border-t border-white/10 space-y-2">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Home className="h-5 w-5" />
                                    <span className="font-medium">Siteye Git</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={async () => {
                                        await logoutAdmin()
                                    }}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Çıkış Yap</span>
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
