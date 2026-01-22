"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Image } from "lucide-react"

interface GalleryItem {
    id: string
    url: string
    caption: string
    order_index: number
}

interface Props {
    items: GalleryItem[]
}

export function GallerySection({ items }: Props) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    // If no items, don't render section
    if (!items || items.length === 0) {
        return null
    }

    const openLightbox = (index: number) => setSelectedIndex(index)
    const closeLightbox = () => setSelectedIndex(null)

    const goNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % items.length)
        }
    }

    const goPrev = () => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + items.length) % items.length)
        }
    }

    return (
        <section className="py-24 bg-slate-900">
            <div className="container px-4 mx-auto max-w-6xl">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
                        Geçmiş Yıllar
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Fotoğraf Galerisi
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => openLightbox(index)}
                        >
                            <img
                                src={image.url}
                                alt={image.caption || "Galeri fotoğrafı"}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {image.caption && (
                                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white font-medium text-sm">{image.caption}</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedIndex !== null && (
                        <motion.div
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeLightbox}
                        >
                            <button
                                onClick={closeLightbox}
                                className="absolute top-4 right-4 text-white hover:text-emerald-400 transition-colors z-10"
                            >
                                <X className="h-8 w-8" />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className="absolute left-4 text-white hover:text-emerald-400 transition-colors"
                            >
                                <ChevronLeft className="h-10 w-10" />
                            </button>

                            <motion.img
                                key={selectedIndex}
                                src={items[selectedIndex].url}
                                alt={items[selectedIndex].caption || "Galeri fotoğrafı"}
                                className="max-w-full max-h-[80vh] rounded-lg"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className="absolute right-4 text-white hover:text-emerald-400 transition-colors"
                            >
                                <ChevronRight className="h-10 w-10" />
                            </button>

                            <div className="absolute bottom-4 text-center text-white">
                                <p className="font-medium">{items[selectedIndex].caption}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
