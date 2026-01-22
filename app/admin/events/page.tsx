import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvents } from "@/app/actions";
import { EventActions } from "@/components/admin/event-actions";

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">Etkinlikler</h1>
                <Link href="/admin/events/create">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
                    </Button>
                </Link>
            </div>

            <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Etkinlik Listesi</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-slate-300">Etkinlik Adı</TableHead>
                                <TableHead className="text-slate-300">Tarih</TableHead>
                                <TableHead className="text-slate-300">Konum</TableHead>
                                <TableHead className="text-slate-300">Durum</TableHead>
                                <TableHead className="text-right text-slate-300">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        Henüz etkinlik yok.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event) => (
                                    <TableRow key={event.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium text-white">{event.title}</TableCell>
                                        <TableCell className="text-slate-300">{event.date}</TableCell>
                                        <TableCell className="text-slate-300">{event.location}</TableCell>
                                        <TableCell>
                                            <Badge className={event.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}>
                                                {event.status === 'published' ? 'Yayında' : 'Taslak'}
                                            </Badge>
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
        </div>
    );
}
