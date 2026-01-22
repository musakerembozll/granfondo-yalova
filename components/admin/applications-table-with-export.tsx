"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ApplicationsTable } from "@/components/admin/applications-table"
import { ExportButton } from "@/components/admin/export-button"
import { BulkActions } from "@/components/admin/bulk-actions"

interface Application {
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
    receiptUrl?: string
}

interface Props {
    applications: Application[]
}

export function ApplicationsTableWithExport({ applications }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const router = useRouter()

    const handleRefresh = () => {
        router.refresh()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="text-slate-400">
                    Toplam {applications.length} başvuru
                </div>
                <ExportButton applications={applications} />
            </div>

            <BulkActions
                selectedIds={selectedIds}
                onClearSelection={() => setSelectedIds([])}
                onRefresh={handleRefresh}
            />

            <ApplicationsTable
                applications={applications as any}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />
        </div>
    )
}
