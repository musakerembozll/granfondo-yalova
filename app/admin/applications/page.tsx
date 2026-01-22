import { getApplications } from "@/app/actions";
import { ApplicationsTableWithExport } from "@/components/admin/applications-table-with-export";

export default async function ApplicationsPage() {
    const applications = await getApplications();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Başvurular</h1>
                    <p className="text-slate-400">Etkinliklere yapılan başvuruları buradan yönetebilirsiniz.</p>
                </div>
            </div>

            <ApplicationsTableWithExport applications={applications} />
        </div>
    );
}
