"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, Bike, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)

    const { user, profile, loading, signOut } = useAuth()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    const navLinks = [
        { name: "Etkinlikler", href: "/etkinlikler" },
        { name: "Parkur", href: "/parkur" },
        { name: "Haberler", href: "/haberler" },
        { name: "Hakkında", href: "/hakkinda" },
        { name: "İletişim", href: "/iletisim" },
    ]

    const handleSignOut = async () => {
        await signOut()
        setIsUserMenuOpen(false)
    }

    return (
        <>
            <motion.header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 md:px-12",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-slate-900/80"
                        : "bg-transparent"
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                    <Bike className="h-8 w-8 text-emerald-500" />
                    <span className={cn("transition-colors", isScrolled ? "text-slate-900 dark:text-white" : "text-white")}>
                        GranFondo Yalova
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                isScrolled ? "text-slate-600 dark:text-slate-300" : "text-white/90"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Auth Buttons */}
                    {loading ? (
                        <div className="w-24 h-10 bg-slate-800/50 rounded-full animate-pulse" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                                    isScrolled
                                        ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                                        : "bg-white/10 hover:bg-white/20 text-white"
                                )}
                            >
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium max-w-[120px] truncate">
                                    {profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Kullanıcı"}
                                </span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isUserMenuOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        <Link
                                            href="/profil"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            Profilim
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 transition-colors w-full"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Çıkış Yap
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/giris">
                                <Button variant="ghost" className={cn(
                                    isScrolled ? "text-slate-600" : "text-white hover:bg-white/10"
                                )}>
                                    Giriş Yap
                                </Button>
                            </Link>
                            <Link href="/kayit">
                                <Button size="lg" className="font-bold rounded-full bg-emerald-500 hover:bg-emerald-600">
                                    Kayıt Ol
                                </Button>
                            </Link>
                        </div>
                    )}
                </nav>

                <button
                    className="md:hidden text-primary p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menüyü aç/kapat"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 pt-20 bg-slate-950/95 backdrop-blur-lg md:hidden"
                    >
                        <nav className="flex flex-col items-center gap-6 p-8">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xl font-medium text-white/90 hover:text-emerald-400 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile Auth */}
                            {user ? (
                                <>
                                    <div className="w-full h-px bg-slate-800 my-2" />
                                    <Link href="/profil" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-white/90 hover:text-emerald-400 transition-colors flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Profilim
                                    </Link>
                                    <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="text-xl font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                                        <LogOut className="h-5 w-5" />
                                        Çıkış Yap
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/giris" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" size="lg" className="font-bold rounded-full mt-4 border-slate-700 text-white">
                                            Giriş Yap
                                        </Button>
                                    </Link>
                                    <Link href="/kayit" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button size="lg" className="font-bold rounded-full bg-emerald-500 hover:bg-emerald-600">
                                            Kayıt Ol
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close user menu */}
            {isUserMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                />
            )}
        </>
    )
}
