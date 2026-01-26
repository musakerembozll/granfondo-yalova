"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

interface ExportButtonProps {
    applications: {
        id: string
        fullName: string
        tcNo: string
        email: string
        phone?: string
        birthDate?: string
        gender?: string
        city?: string
        club?: string
        category: string
        emergencyName?: string
        emergencyPhone?: string
        status: string
        createdAt: string
    }[]
}

export function ExportButton({ applications }: ExportButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        
        // Dynamic import - reduces initial bundle size by ~200KB
        const XLSX = await import("xlsx")
        
        // Veriyi Excel formatına dönüştür
        const data = applications.map((app, index) => ({
            "Sıra": index + 1,
            "Ad Soyad": app.fullName,
            "TC Kimlik No": app.tcNo,
            "E-posta": app.email,
            "Telefon": app.phone || "-",
            "Doğum Tarihi": app.birthDate || "-",
            "Cinsiyet": app.gender === "male" ? "Erkek" : app.gender === "female" ? "Kadın" : "-",
            "Şehir": app.city || "-",
            "Kulüp": app.club || "-",
            "Parkur": app.category === "long" ? "Uzun Parkur" : "Kısa Parkur",
            "Acil Durum Kişisi": app.emergencyName || "-",
            "Acil Durum Telefonu": app.emergencyPhone || "-",
            "Durum": app.status === "approved" ? "Onaylı" : app.status === "rejected" ? "Reddedildi" : "Beklemede",
            "Kayıt Tarihi": new Date(app.createdAt).toLocaleString('tr-TR')
        }))

        // Workbook oluştur
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Başvurular")

        // Sütun genişliklerini ayarla
        worksheet["!cols"] = [
            { wch: 5 },   // Sıra
            { wch: 25 },  // Ad Soyad
            { wch: 15 },  // TC
            { wch: 30 },  // E-posta
            { wch: 15 },  // Telefon
            { wch: 12 },  // Doğum Tarihi
            { wch: 10 },  // Cinsiyet
            { wch: 15 },  // Şehir
            { wch: 20 },  // Kulüp
            { wch: 15 },  // Parkur
            { wch: 20 },  // Acil Durum Kişisi
            { wch: 15 },  // Acil Durum Telefonu
            { wch: 12 },  // Durum
            { wch: 20 }   // Kayıt Tarihi
        ]

        // Dosyayı indir
        const fileName = `GranFondo_Basvurular_${new Date().toISOString().split('T')[0]}.xlsx`
        XLSX.writeFile(workbook, fileName)
        
        setLoading(false)
    }

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            Excel İndir ({applications.length})
        </Button>
    )
}
