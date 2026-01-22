"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X, Trash2 } from "lucide-react"
import { updateApplicationStatus, deleteApplication } from "@/app/actions"
import { toast } from "sonner"

interface BulkActionsProps {
    selectedIds: string[]
    onClearSelection: () => void
    onRefresh: () => void
}

export function BulkActions({ selectedIds, onClearSelection, onRefresh }: BulkActionsProps) {
    const [loading, setLoading] = useState(false)

    if (selectedIds.length === 0) return null

    const handleBulkApprove = async () => {
        setLoading(true)
        try {
            for (const id of selectedIds) {
                await updateApplicationStatus(id, "approved")
            }
            toast.success(`${selectedIds.length} başvuru onaylandı`)
            onClearSelection()
            onRefresh()
        } catch (error) {
            toast.error("Bir hata oluştu")
        }
        setLoading(false)
    }

    const handleBulkReject = async () => {
        setLoading(true)
        try {
            for (const id of selectedIds) {
                await updateApplicationStatus(id, "rejected")
            }
            toast.success(`${selectedIds.length} başvuru reddedildi`)
            onClearSelection()
            onRefresh()
        } catch (error) {
            toast.error("Bir hata oluştu")
        }
        setLoading(false)
    }

    const handleBulkDelete = async () => {
        if (!confirm(`${selectedIds.length} başvuruyu silmek istediğinize emin misiniz?`)) return

        setLoading(true)
        try {
            for (const id of selectedIds) {
                await deleteApplication(id)
            }
            toast.success(`${selectedIds.length} başvuru silindi`)
            onClearSelection()
            onRefresh()
        } catch (error) {
            toast.error("Bir hata oluştu")
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-white/10 rounded-lg mb-4">
            <span className="text-white font-medium">
                {selectedIds.length} seçili
            </span>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={handleBulkApprove}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    <Check className="h-4 w-4 mr-1" />
                    Onayla
                </Button>
                <Button
                    size="sm"
                    onClick={handleBulkReject}
                    disabled={loading}
                    variant="outline"
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                >
                    <X className="h-4 w-4 mr-1" />
                    Reddet
                </Button>
                <Button
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={loading}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Sil
                </Button>
            </div>
            <Button
                size="sm"
                variant="ghost"
                onClick={onClearSelection}
                className="ml-auto text-slate-400"
            >
                Seçimi Temizle
            </Button>
        </div>
    )
}
