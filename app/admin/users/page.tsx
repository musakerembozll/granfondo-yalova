import { UsersManager } from "@/components/admin/users-manager"

export default function UsersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Kayıtlı Kullanıcılar</h1>
            <UsersManager />
        </div>
    )
}
