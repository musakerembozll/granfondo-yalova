import { getContactMessages } from "@/app/actions"
import { getAdminSession } from "@/app/admin/auth-actions"
import { MessagesClient } from "@/components/admin/messages-client"

export default async function MessagesPage({
    searchParams,
}: {
    searchParams: { filter?: string }
}) {
    const filter = (searchParams.filter as 'inbox' | 'archive' | 'trash') || 'inbox'
    const messages = await getContactMessages(filter)
    const session = await getAdminSession()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Mesajlar</h1>
                <p className="text-slate-400">İletişim formundan gelen mesajları buradan yönetebilirsiniz.</p>
            </div>

            <MessagesClient
                messages={messages}
                currentFilter={filter}
                adminName={session?.name || 'Admin'}
            />
        </div>
    )
}
