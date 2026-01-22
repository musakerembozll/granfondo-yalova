"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { deleteEvent } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface EventActionsProps {
    id: string
    title: string
}

export function EventActions({ id, title }: EventActionsProps) {
    const { toast } = useToast()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`"${title}" etkinliğini silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            const result = await deleteEvent(id)
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
        <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/events/${id}/edit`}>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </Link>
            <Button
                variant="destructive"
                size="icon"
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                onClick={handleDelete}
            >
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    )
}

