"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload, Image as ImageIcon, Video, Globe, Copy,
  Check, Loader2, ExternalLink, RefreshCw, Film, FileImage, Settings as SettingsIcon
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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
  },
  {
    id: 'page',
    name: 'Sayfa Arkaplanları',
    icon: FileImage,
    description: 'Hakkında, Parkur ve diğer sayfa arkaplanları',
    items: [
      {
        key: 'about_bg',
        label: 'Hakkında Arka Plan',
        category: 'page' as const,
        recommended: '1920x1080 veya daha büyük',
        placeholder: 'https://images.unsplash.com/...',
        url: '',
        alt_text: 'About Background'
      },
      {
        key: 'parkur_bg',
        label: 'Parkur Arka Plan',
        category: 'page' as const,
        recommended: '1920x1080 veya daha büyük',
        placeholder: 'https://images.unsplash.com/...',
        url: '',
        alt_text: 'Parkur Background'
      },
      {
        key: 'contact_bg',
        label: 'İletişim Arka Plan',
        category: 'page' as const,
        recommended: '1920x1080 veya daha büyük',
        placeholder: 'https://images.unsplash.com/...',
        url: '',
        alt_text: 'Contact Background'
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
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

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

  const handleUrlChange = (key: string, url: string) => {
    setMediaItems(prev => prev.map(item =>
      item.key === key ? { ...item, url } : item
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

      const { error } = await supabase
        .from('site_images')
        .upsert({
          key: item.key,
          url: item.url,
          alt_text: item.alt_text
        }, {
          onConflict: 'key'
        })

      if (error) throw error

      toast.success(`${item.label} kaydedildi`)
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Kaydetme hatası')
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

      if (!response.ok) throw new Error(result.error)

      // Update local state
      setMediaItems(prev => prev.map(item =>
        item.key === key ? { ...item, url: result.url } : item
      ))

      toast.success('Dosya yüklendi')

      // Auto-save after upload
      setTimeout(() => handleSave(key), 500)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Yükleme hatası')
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
        <TabsList className="bg-slate-900 border border-white/10">
          {mediaCategories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
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
                        <div className="flex gap-2">
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
                            className="bg-slate-800 border-white/10 hover:bg-slate-700"
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

                          <Button
                            size="sm"
                            onClick={() => handleSave(item.key)}
                            disabled={isSaving}
                            className="bg-emerald-500 hover:bg-emerald-600"
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
        <CardContent className="p-4">
          <p className="text-blue-400 text-sm flex items-start gap-2">
            <ImageIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>
              <strong>İpucu:</strong> Görselleri Supabase Storage'a yüklemek için "Dosya Yükle" butonunu kullanın.
              Harici URL'ler (Unsplash, Pexels vb.) de desteklenir. Değişiklikleri kaydetmeyi unutmayın!
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
