"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Loader2 } from "lucide-react"
import { setActiveEvent } from "@/app/actions"
import { toast } from "sonner"

interface SetActiveEventButtonProps {
    eventId: string
}

export function SetActiveEventButton({ eventId }: SetActiveEventButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleSetActive = async () => {
        setLoading(true)
        try {
            const result = await setActiveEvent(eventId)
            if (result.success) {
                toast.success("Etkinlik ana sayfa etkinliği olarak ayarlandı!")
                // Refresh the page to show updated status
                window.location.reload()
            } else {
                toast.error(result.message || "Bir hata oluştu")
            }
        } catch (error) {
            toast.error("Bir hata oluştu")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleSetActive}
            disabled={loading}
            className="bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-300 hover:text-white"
        >
            {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
                <>
                    <Star className="h-3 w-3 mr-1" />
                    Aktif Yap
                </>
            )}
        </Button>
    )
}
