"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Mail, ExternalLink } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ApplicationActions } from "@/components/admin/application-actions"

interface Application {
    id: string
    fullName: string
    tcNo: string
    email: string
    category: "long" | "short"
    status: "pending" | "approved" | "rejected"
    createdAt: string
    receiptUrl?: string
    userId?: string
}

interface ApplicationsTableProps {
    applications: Application[]
    selectedIds?: string[]
    onSelectionChange?: (ids: string[]) => void
}

export function ApplicationsTable({ applications, selectedIds = [], onSelectionChange }: ApplicationsTableProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredApplications = applications.filter((app) => {
        const query = searchQuery.toLowerCase()
        return (
            app.fullName.toLowerCase().includes(query) ||
            app.tcNo.includes(query) ||
            app.email.toLowerCase().includes(query)
        )
    })

    const toggleSelection = (id: string) => {
        if (!onSelectionChange) return

        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id))
        } else {
            onSelectionChange([...selectedIds, id])
        }
    }

    const toggleAll = () => {
        if (!onSelectionChange) return

        if (selectedIds.length === filteredApplications.length) {
            onSelectionChange([])
        } else {
            onSelectionChange(filteredApplications.map(a => a.id))
        }
    }

    return (
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white">Son Başvurular</CardTitle>
                <CardDescription className="text-slate-400">
                    {searchQuery
                        ? `${filteredApplications.length} / ${applications.length} başvuru gösteriliyor.`
                        : `Toplam ${applications.length} başvuru bulundu.`
                    }
                </CardDescription>
                <div className="pt-4 relative">
                    <Search className="absolute left-3 top-7 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="İsim, TC veya e-posta ile ara..."
                        className="max-w-sm bg-slate-950 border-white/10 text-white placeholder:text-slate-500 pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                {onSelectionChange && (
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                                            onCheckedChange={toggleAll}
                                            className="border-slate-600"
                                        />
                                    </TableHead>
                                )}
                                <TableHead className="text-slate-300">Ad Soyad</TableHead>
                                <TableHead className="text-slate-300">E-posta</TableHead>
                                <TableHead className="text-slate-300">TC / Pasaport</TableHead>
                                <TableHead className="text-slate-300">Kategori</TableHead>
                                <TableHead className="text-slate-300">Durum</TableHead>
                                <TableHead className="text-slate-300">Tarih</TableHead>
                                <TableHead className="text-slate-300">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.length === 0 ? (
                                <TableRow className="border-white/10 hover:bg-white/5">
                                    <TableCell colSpan={onSelectionChange ? 8 : 7} className="text-center py-8 text-slate-500">
                                        {searchQuery ? "Aramanızla eşleşen başvuru bulunamadı." : "Henüz başvuru yok."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApplications.map((app) => (
                                    <TableRow
                                        key={app.id}
                                        className={`border-white/10 hover:bg-white/5 ${selectedIds.includes(app.id) ? 'bg-white/5' : ''}`}
                                    >
                                        {onSelectionChange && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(app.id)}
                                                    onCheckedChange={() => toggleSelection(app.id)}
                                                    className="border-slate-600"
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                {app.fullName}
                                                {app.userId && (
                                                    <Link href={`/admin/users?highlight=${app.userId}`}>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-400 hover:text-emerald-300">
                                                            <ExternalLink className="h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                                                <Mail className="h-3.5 w-3.5" />
                                                <span className="text-sm">{app.email}</span>
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{app.tcNo}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                                                {app.category === 'long' ? 'Uzun Parkur' : 'Kısa Parkur'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    app.status === 'approved'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : app.status === 'rejected'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                }
                                            >
                                                {app.status === 'pending' ? 'Beklemede' : (app.status === 'approved' ? 'Onaylandı' : 'Reddedildi')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400">
                                            {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                                        </TableCell>
                                        <TableCell>
                                            <ApplicationActions id={app.id} currentStatus={app.status} receiptUrl={app.receiptUrl} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

