import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getAdminSession } from "@/app/admin/auth-actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin Panel | GranFondo Yalova",
    description: "Yönetim Paneli",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAdminSession();

    // If not logged in, redirect to login
    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-950 text-white selection:bg-emerald-500/30">
            <AdminSidebar user={user} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Content with mobile top padding for header */}
                <div className="p-4 pt-20 lg:pt-6 lg:p-10 relative z-10 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
