import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/app/actions";
import { EventsTableClient } from "@/components/admin/events-table-client";

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Etkinlikler</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Ana sayfada gösterilecek etkinliği seçebilir ve yönetebilirsiniz.
                    </p>
                </div>
                <Link href="/admin/events/create">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
                    </Button>
                </Link>
            </div>

            <EventsTableClient events={events} />
        </div>
    );
}
