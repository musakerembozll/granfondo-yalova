import { getDashboardStats } from "@/app/actions";
import { AdminDashboardClient } from "@/components/admin/dashboard-client";

export default async function AdminDashboard() {
    const stats = await getDashboardStats();
    return <AdminDashboardClient stats={stats} />;
}
