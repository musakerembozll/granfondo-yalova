import { SponsorManager } from "@/components/admin/sponsor-manager"

export default function SponsorsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Sponsor Yönetimi</h1>
                <p className="text-slate-400">
                    Ana sayfada görünecek sponsorları buradan yönetebilirsiniz.
                </p>
            </div>

            <SponsorManager />
        </div>
    )
}
