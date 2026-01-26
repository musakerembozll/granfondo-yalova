"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload, Image as ImageIcon, Video, Globe, Copy,
  Check, Loader2, ExternalLink, RefreshCw, Film, Settings as SettingsIcon, Search, X
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

// Unsplash arama için önceden hazırlanmış görseller (API key gerektirmez)
const PRESET_IMAGES = {
  cycling: [
    { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&h=900&fit=crop', label: 'Bisiklet yarışı' },
    { url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1600&h=900&fit=crop', label: 'Dağ bisikleti' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop', label: 'Yol bisikleti' },
    { url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1600&h=900&fit=crop', label: 'Bisiklet grubu' },
    { url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1600&h=900&fit=crop', label: 'Bisiklet detay' },
    { url: 'https://images.unsplash.com/photo-1697951950160-6b6dcdb16f67?w=1600&h=900&fit=crop', label: 'Bisiklet tekerlek' },
  ],
  nature: [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop', label: 'Dağ manzarası' },
    { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&h=900&fit=crop', label: 'Yeşil doğa' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=900&fit=crop', label: 'Orman yolu' },
    { url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&h=900&fit=crop', label: 'Koşu' },
  ]
}

interface MediaItem {
  key: string
  label: string
  url: string
  alt_text: string
  category: 'hero' | 'system' | 'page'
  recommended?: string
  placeholder?: string
}

const mediaCategories = [
  {
    id: 'hero',
    name: 'Ana Sayfa',
    icon: Film,
    description: 'Ana sayfadaki video ve görsel',
    items: [
      {
        key: 'hero_video',
        label: 'Ana Sayfa Video',
        category: 'hero' as const,
        recommended: 'Video URL (Pexels, YouTube vb.)',
        placeholder: 'https://videos.pexels.com/...',
        url: '',
        alt_text: 'Hero Video'
      },
      {
        key: 'hero_image',
        label: 'Ana Sayfa Yedek Görsel',
        category: 'hero' as const,
        recommended: '1920x1080 veya daha büyük (WebP/JPG)',
        placeholder: 'https://images.unsplash.com/...',
        url: '',
        alt_text: 'Hero Fallback Image'
      }
    ]
  },
  {
    id: 'system',
    name: 'Sistem',
    icon: SettingsIcon,
    description: 'Logo, favicon ve sosyal medya görseli',
    items: [
      {
        key: 'logo',
        label: 'Site Logosu',
        category: 'system' as const,
        recommended: 'SVG veya PNG (şeffaf arka plan)',
        placeholder: '/logo.svg',
        url: '',
        alt_text: 'GranFondo Yalova Logo'
      },
      {
        key: 'favicon',
        label: 'Favicon',
        category: 'system' as const,
        recommended: '64x64 veya 32x32 (ICO/PNG)',
        placeholder: '/favicon.ico',
        url: '',
        alt_text: 'Favicon'
      },
      {
        key: 'og_image',
        label: 'Sosyal Medya Paylaşım Görseli',
        category: 'system' as const,
        recommended: '1200x630 (Facebook/Twitter için ideal)',
        placeholder: '/og-image.jpg',
        url: '',
        alt_text: 'OG Image'
      }
    ]
  }
]

export function UnifiedMediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState<string | null>(null) // key of item to show gallery for
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Galeriden resim seç
  const handleSelectFromGallery = (key: string, url: string) => {
    setMediaItems(prev => prev.map(item =>
      item.key === key ? { ...item, url } : item
    ))
    setShowGallery(null)
    toast.success('Görsel seçildi, kaydetmeyi unutmayın!')
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')

      if (error) throw error

      // Merge with defaults
      const allItems: MediaItem[] = mediaCategories.flatMap(cat => cat.items as MediaItem[])
      const merged = allItems.map(item => {
        const found = data?.find((d: any) => d.key === item.key)
        return found ? { ...item, url: found.url, alt_text: found.alt_text || item.alt_text } : item
      })

      setMediaItems(merged)
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Medya yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Unsplash/Pexels URL'lerini otomatik düzelt
  const normalizeImageUrl = (url: string): string => {
    if (!url) return url
    
    // Unsplash sayfa URL'sini resim URL'sine çevir
    // https://unsplash.com/photos/xxxxx-PHOTOID -> https://images.unsplash.com/photo-PHOTOID
    const unsplashPageMatch = url.match(/unsplash\.com\/photos\/[^\/]+-([a-zA-Z0-9_-]+)/)
    if (unsplashPageMatch) {
      // Photo ID'yi al ve source API kullan (daha güvenilir)
      return `https://source.unsplash.com/${unsplashPageMatch[1]}/1600x900`
    }
    
    // unsplash.com/photos/PHOTOID formatı
    const unsplashSimpleMatch = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)$/)
    if (unsplashSimpleMatch) {
      return `https://source.unsplash.com/${unsplashSimpleMatch[1]}/1600x900`
    }
    
    // Pexels sayfa URL'sini düzelt
    // https://www.pexels.com/photo/xxxxx-12345678/ -> direkt kullanılamaz, uyarı ver
    if (url.includes('pexels.com/photo/') && !url.includes('images.pexels.com')) {
      toast.error('Pexels için resme sağ tıklayıp "Resim adresini kopyala" kullanın')
      return url
    }
    
    return url
  }

  const handleUrlChange = (key: string, url: string) => {
    const normalizedUrl = normalizeImageUrl(url)
    setMediaItems(prev => prev.map(item =>
      item.key === key ? { ...item, url: normalizedUrl } : item
    ))
  }

  const handleAltTextChange = (key: string, alt_text: string) => {
    setMediaItems(prev => prev.map(item =>
      item.key === key ? { ...item, alt_text } : item
    ))
  }

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      const item = mediaItems.find(m => m.key === key)
      if (!item) throw new Error('Item not found')

      console.log('Saving media:', { key: item.key, url: item.url, alt_text: item.alt_text })

      // Use API endpoint instead of direct Supabase call
      const response = await fetch('/api/admin/save-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: item.key,
          url: item.url,
          alt_text: item.alt_text
        })
      })

      console.log('Response status:', response.status)
      
      const result = await response.json()
      console.log('Response body:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Kaydetme hatası')
      }

      toast.success(`${item.label} kaydedildi`)
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error?.message || 'Kaydetme hatası')
    } finally {
      setSaving(null)
    }
  }

  const handleFileUpload = async (key: string, file: File) => {
    setUploading(key)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', key)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Yükleme başarısız')
      }

      // Update local state
      setMediaItems(prev => prev.map(item =>
        item.key === key ? { ...item, url: result.url } : item
      ))

      toast.success(result.message || 'Dosya yüklendi')

      // Auto-save after upload
      setTimeout(() => handleSave(key), 500)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error?.message || 'Yükleme hatası')
    } finally {
      setUploading(null)
    }
  }

  const handleCopyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    toast.success('URL kopyalandı')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Medya Yönetimi</h2>
          <p className="text-slate-400 mt-1">Tüm site görsellerini tek yerden yönetin</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchMedia}
          className="bg-slate-800 border-white/10 hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="bg-slate-800/80 border border-white/10">
          {mediaCategories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-slate-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {mediaCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card className="bg-slate-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-emerald-400" />
                  {category.name}
                </CardTitle>
                <p className="text-sm text-slate-400">{category.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {category.items.map(defaultItem => {
                  const item = mediaItems.find(m => m.key === defaultItem.key) || defaultItem
                  const isSaving = saving === item.key
                  const isUploading = uploading === item.key
                  const isCopied = copiedKey === item.key

                  return (
                    <div key={item.key} className="space-y-3 p-4 bg-slate-950 rounded-lg border border-white/5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-white">{item.label}</h4>
                          <p className="text-xs text-slate-500 mt-1">{item.recommended}</p>
                        </div>
                        {item.url && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(item.url, '_blank')}
                              className="h-8 text-slate-400 hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyUrl(item.url, item.key)}
                              className="h-8 text-slate-400 hover:text-white"
                            >
                              {isCopied ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-3">
                        {/* URL Input */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400">URL</label>
                          <Input
                            type="text"
                            value={item.url}
                            onChange={(e) => handleUrlChange(item.key, e.target.value)}
                            placeholder={item.placeholder}
                            className="bg-slate-900 border-white/10 text-white"
                          />
                        </div>

                        {/* Alt Text Input */}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400">Alt Text (SEO)</label>
                          <Input
                            type="text"
                            value={item.alt_text}
                            onChange={(e) => handleAltTextChange(item.key, e.target.value)}
                            placeholder="Görsel açıklaması"
                            className="bg-slate-900 border-white/10 text-white"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <input
                            ref={(el) => { fileInputRefs.current[item.key] = el }}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(item.key, file)
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fileInputRefs.current[item.key]?.click()}
                            disabled={isUploading}
                            className="bg-slate-800 border-white/10 hover:bg-slate-700 text-white"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Yükleniyor...
                              </>
                            ) : (
                              <>
                                <Upload className="h-3 w-3 mr-2" />
                                Dosya Yükle
                              </>
                            )}
                          </Button>

                          {/* Galeri Seç Butonu - sadece resimler için */}
                          {item.key !== 'hero_video' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowGallery(item.key)}
                              className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-300"
                            >
                              <Search className="h-3 w-3 mr-2" />
                              Galeriden Seç
                            </Button>
                          )}

                          <Button
                            size="sm"
                            onClick={() => handleSave(item.key)}
                            disabled={isSaving}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Kaydediliyor...
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-2" />
                                Kaydet
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Galeri Popup */}
                        {showGallery === item.key && (
                          <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium">Hazır Görseller</h4>
                              <Button size="sm" variant="ghost" onClick={() => setShowGallery(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs text-slate-400 mb-2">🚴 Bisiklet & Yarış</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {PRESET_IMAGES.cycling.map((img, i) => (
                                    <button
                                      key={i}
                                      onClick={() => handleSelectFromGallery(item.key, img.url)}
                                      className="aspect-video rounded overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all"
                                    >
                                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-2">🌿 Doğa</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {PRESET_IMAGES.nature.map((img, i) => (
                                    <button
                                      key={i}
                                      onClick={() => handleSelectFromGallery(item.key, img.url)}
                                      className="aspect-video rounded overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all"
                                    >
                                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Preview */}
                      {item.url && (
                        <div className="mt-3 p-3 bg-slate-900/50 rounded border border-white/5">
                          <p className="text-xs text-slate-400 mb-2">Önizleme:</p>
                          {item.key === 'hero_video' ? (
                            <div className="w-full aspect-video rounded overflow-hidden bg-slate-800">
                              <video
                                src={item.url}
                                className="w-full h-full object-contain rounded"
                                muted
                                loop
                                autoPlay
                                playsInline
                                controls
                              />
                            </div>
                          ) : item.key === 'logo' || item.key === 'favicon' ? (
                            <div className="w-32 aspect-square rounded overflow-hidden bg-slate-800 flex items-center justify-center">
                              <img
                                src={item.url}
                                alt={item.alt_text}
                                className="w-full h-full object-contain rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            </div>
                          ) : item.key === 'og_image' ? (
                            <div className="w-full aspect-[1.91/1] rounded overflow-hidden bg-slate-800">
                              <img
                                src={item.url}
                                alt={item.alt_text}
                                className="w-full h-full object-contain rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-video rounded overflow-hidden bg-slate-800">
                              <img
                                src={item.url}
                                alt={item.alt_text}
                                className="w-full h-full object-contain rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4 space-y-2">
          <p className="text-blue-400 text-sm flex items-start gap-2">
            <ImageIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>
              <strong>İpucu:</strong> Görselleri Supabase Storage'a yüklemek için "Dosya Yükle" butonunu kullanın (maks. 4MB).
              Harici URL'ler de desteklenir. <strong>Değişiklikleri kaydetmeyi unutmayın!</strong>
            </span>
          </p>
          <p className="text-amber-400 text-xs ml-7">
            ⚠️ <strong>Unsplash için:</strong> Sayfa URL'si değil, doğrudan resim URL'si kullanın.<br/>
            ✅ Doğru: <code className="bg-slate-800 px-1 rounded">https://images.unsplash.com/photo-xxxxx</code><br/>
            ❌ Yanlış: <code className="bg-slate-800 px-1 rounded">https://unsplash.com/photos/xxxxx</code>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
