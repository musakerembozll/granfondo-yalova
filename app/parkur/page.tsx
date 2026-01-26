import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { getActiveEvent } from "@/app/actions"
import { ParkurClient } from "@/components/landing/parkur-client"

export const revalidate = 0;

export default async function ParkurPage() {
    const activeEvent = await getActiveEvent()

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
            <Navbar activeEvent={activeEvent} />

            <div className="flex-1 pt-28 pb-16">
                 <ParkurClient activeEvent={activeEvent} />
            </div>

            <Footer activeEvent={activeEvent} />
        </main>
    )
}
