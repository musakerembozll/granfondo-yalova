"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { QrCode, Download, User, Calendar, MapPin, Award, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Participant {
    id: string
    fullName: string
    email: string
    category: string
    bibNumber?: string
    status: string
}

interface ParticipantCardProps {
    participants: Participant[]
}

function generateBibNumber(id: string): string {
    // Generate a deterministic bib number from ID
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return String(1000 + (hash % 9000)).padStart(4, '0')
}

function ParticipantCard({ participant, onDownload }: { participant: Participant; onDownload: () => void }) {
    const bibNumber = participant.bibNumber || generateBibNumber(participant.id)
    const qrData = `GRANFONDO2026|${participant.id}|${bibNumber}|${participant.fullName}`

    // Generate QR code URL using a free QR API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&bgcolor=0d1117&color=10b981`

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-center">
                <h3 className="text-xl font-bold text-white">GranFondo Yalova 2026</h3>
                <p className="text-white/80 text-sm">Katılım Kartı</p>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex gap-6">
                    {/* QR Code */}
                    <div className="flex-shrink-0">
                        <div className="bg-white p-2 rounded-lg">
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                className="w-[120px] h-[120px]"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Katılımcı</div>
                            <div className="text-lg font-bold text-white">{participant.fullName}</div>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Bib No</div>
                                <div className="text-2xl font-black text-emerald-400">#{bibNumber}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Parkur</div>
                                <div className="text-white font-medium">
                                    {participant.category === 'long' ? 'Uzun (98km)' : 'Kısa (55km)'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-white/10 pt-4">
                    <div className="flex flex-col items-center">
                        <Calendar className="h-4 w-4 text-emerald-400 mb-1" />
                        <span className="text-xs text-slate-400">12 Eylül 2026</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <MapPin className="h-4 w-4 text-emerald-400 mb-1" />
                        <span className="text-xs text-slate-400">Yalova</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Award className="h-4 w-4 text-emerald-400 mb-1" />
                        <span className="text-xs text-slate-400">4. Yıl</span>
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <div className="px-6 pb-6">
                <Button
                    onClick={onDownload}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Kartı İndir
                </Button>
            </div>
        </div>
    )
}

export function ParticipantCardGenerator({ participants }: ParticipantCardProps) {
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const approvedParticipants = participants.filter(p => p.status === 'approved')
    const filteredParticipants = approvedParticipants.filter(p =>
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDownload = async (participant: Participant) => {
        // In production, this would generate a PDF
        // For now, we'll open the card in a new window for printing
        const bibNumber = participant.bibNumber || generateBibNumber(participant.id)
        const qrData = `GRANFONDO2026|${participant.id}|${bibNumber}|${participant.fullName}`
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=10b981`

        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Katılım Kartı - ${participant.fullName}</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            margin: 0;
                            padding: 40px;
                            display: flex;
                            justify-content: center;
                        }
                        .card {
                            width: 400px;
                            border: 2px solid #10b981;
                            border-radius: 16px;
                            overflow: hidden;
                        }
                        .header {
                            background: linear-gradient(90deg, #10b981, #14b8a6);
                            padding: 20px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 { margin: 0; font-size: 24px; }
                        .header p { margin: 4px 0 0; opacity: 0.8; }
                        .content { padding: 24px; }
                        .qr-row { display: flex; gap: 20px; }
                        .qr { background: white; padding: 8px; border-radius: 8px; }
                        .info { flex: 1; }
                        .label { font-size: 10px; color: #64748b; text-transform: uppercase; }
                        .name { font-size: 20px; font-weight: bold; color: #0f172a; }
                        .bib { font-size: 32px; font-weight: 900; color: #10b981; }
                        .category { font-size: 14px; color: #0f172a; }
                        .details { 
                            display: flex; 
                            justify-content: space-around; 
                            margin-top: 20px;
                            padding-top: 16px;
                            border-top: 1px solid #e2e8f0;
                            text-align: center;
                        }
                        .details span { font-size: 12px; color: #64748b; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="header">
                            <h1>GranFondo Yalova 2026</h1>
                            <p>Katılım Kartı</p>
                        </div>
                        <div class="content">
                            <div class="qr-row">
                                <div class="qr">
                                    <img src="${qrUrl}" width="150" height="150" />
                                </div>
                                <div class="info">
                                    <div class="label">Katılımcı</div>
                                    <div class="name">${participant.fullName}</div>
                                    <div style="margin-top: 12px;">
                                        <div class="label">Bib No</div>
                                        <div class="bib">#${bibNumber}</div>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        <div class="label">Parkur</div>
                                        <div class="category">${participant.category === 'long' ? 'Uzun Parkur (98km)' : 'Kısa Parkur (55km)'}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="details">
                                <span>📅 12 Eylül 2026</span>
                                <span>📍 Yalova</span>
                                <span>🏆 4. Yıl</span>
                            </div>
                        </div>
                    </div>
                    <script>
                        setTimeout(() => window.print(), 500);
                    </script>
                </body>
                </html>
            `)
            printWindow.document.close()
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <QrCode className="h-8 w-8 text-emerald-400" />
                    Katılımcı Kartları
                </h1>
                <p className="text-slate-400 mt-1">QR kodlu katılımcı kartları oluşturun</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Participant List */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Katılımcı ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    {approvedParticipants.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Henüz onaylı katılımcı yok</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {filteredParticipants.map(participant => (
                                <button
                                    key={participant.id}
                                    onClick={() => setSelectedParticipant(participant)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedParticipant?.id === participant.id
                                            ? 'bg-emerald-500/20 border-emerald-500/50'
                                            : 'bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-white">{participant.fullName}</div>
                                            <div className="text-xs text-slate-500">{participant.email}</div>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded ${participant.category === 'long'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-cyan-500/20 text-cyan-400'
                                            }`}>
                                            {participant.category === 'long' ? '98km' : '55km'}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Card Preview */}
                <div>
                    {selectedParticipant ? (
                        <ParticipantCard
                            participant={selectedParticipant}
                            onDownload={() => handleDownload(selectedParticipant)}
                        />
                    ) : (
                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-12 text-center">
                            <QrCode className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                            <p className="text-slate-500">Kart önizleme için bir katılımcı seçin</p>
                        </div>
                    )}

                    {selectedParticipant && (
                        <div className="mt-4 flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleDownload(selectedParticipant)}
                            >
                                <Printer className="h-4 w-4 mr-2" />
                                Yazdır
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
