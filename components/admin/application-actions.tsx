"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Trash2, FileImage } from "lucide-react"
import { updateApplicationStatus, deleteApplication } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ApplicationActionsProps {
    id: string
    currentStatus: string
    receiptUrl?: string
}

export function ApplicationActions({ id, currentStatus, receiptUrl }: ApplicationActionsProps) {
    const { toast } = useToast()
    const router = useRouter()

    const handleStatusUpdate = async (status: "approved" | "rejected") => {
        try {
            await updateApplicationStatus(id, status)
            toast({
                title: status === "approved" ? "Onaylandı" : "Reddedildi",
                description: "Başvuru durumu güncellendi.",
                className: status === "approved" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Hata",
                description: "İşlem gerçekleştirilemedi.",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async () => {
        if (!confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return

        try {
            const result = await deleteApplication(id)
            if (result.success) {
                toast({
                    title: "Silindi",
                    description: result.message,
                    className: "bg-emerald-500 text-white"
                })
                router.refresh()
            } else {
                toast({
                    title: "Hata",
                    description: result.message,
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Hata",
                description: "İşlem gerçekleştirilemedi.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex items-center gap-1">
            {/* Receipt View Button */}
            {receiptUrl && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                            title="Dekontu Görüntüle"
                        >
                            <FileImage className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/10 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-white">Ödeme Dekontu</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <img
                                src={receiptUrl}
                                alt="Ödeme dekontu"
                                className="w-full rounded-lg"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Status Buttons */}
            {currentStatus === "pending" && (
                <>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                        onClick={() => handleStatusUpdate("approved")}
                        title="Onayla"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                        onClick={() => handleStatusUpdate("rejected")}
                        title="Reddet"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </>
            )}

            {currentStatus === "approved" && (
                <span className="text-emerald-400 text-xs px-2">Onaylı</span>
            )}

            {currentStatus === "rejected" && (
                <span className="text-red-400 text-xs px-2">Reddedildi</span>
            )}

            {/* Delete Button */}
            <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                onClick={handleDelete}
                title="Sil"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
