"use client"

import { useState } from "react"
import { Search, Star, Filter } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventActions } from "@/components/admin/event-actions"
import { SetActiveEventButton } from "@/components/admin/set-active-event-button"

interface Event {
    id: string
    title: string
    date: string
    location: string
    status: string
    active_event: boolean
}

interface EventsTableClientProps {
    events: Event[]
}

export function EventsTableClient({ events }: EventsTableClientProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string | null>(null)

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter ? event.status === statusFilter : true
        return matchesSearch && matchesStatus
    })

    return (
        <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
            <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div>
                        <CardTitle className="text-white">Etkinlik Listesi</CardTitle>
                        <CardDescription className="text-slate-400">
                             {filteredEvents.length} / {events.length} etkinlik gösteriliyor
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Etkinlik ara..."
                                className="w-full md:w-64 bg-slate-950 border-white/10 text-white placeholder:text-slate-500 pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {statusFilter === 'published' ? 'Yayında' :
                                     statusFilter === 'draft' ? 'Taslak' :
                                     statusFilter === 'cancelled' ? 'İptal' : 'Filtrele'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-300">
                                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                                    Tümü
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                                    Yayında
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                                    Taslak
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                                    İptal
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-slate-300">Etkinlik Adı</TableHead>
                            <TableHead className="text-slate-300">Tarih</TableHead>
                            <TableHead className="text-slate-300">Konum</TableHead>
                            <TableHead className="text-slate-300">Durum</TableHead>
                            <TableHead className="text-slate-300">Ana Sayfa</TableHead>
                            <TableHead className="text-right text-slate-300">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEvents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    {searchQuery || statusFilter ? "Arama kriterlerine uygun etkinlik bulunamadı." : "Henüz etkinlik yok."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEvents.map((event) => (
                                <TableRow key={event.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{event.title}</TableCell>
                                    <TableCell className="text-slate-300">{event.date}</TableCell>
                                    <TableCell className="text-slate-300">{event.location}</TableCell>
                                    <TableCell>
                                        <Badge className={event.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}>
                                            {event.status === 'published' ? 'Yayında' : event.status === 'cancelled' ? 'İptal' : 'Taslak'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {event.active_event ? (
                                            <Badge className="bg-emerald-500/20 text-emerald-400 flex items-center gap-1 w-fit">
                                                <Star className="h-3 w-3 fill-emerald-400" />
                                                Aktif
                                            </Badge>
                                        ) : (
                                            <SetActiveEventButton eventId={event.id} />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <EventActions id={event.id} title={event.title} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
