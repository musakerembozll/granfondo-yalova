import { BulkEmailSender } from "@/components/admin/bulk-email-sender"
import { getApplications } from "@/app/actions"

export default async function BulkEmailPage() {
    const applications = await getApplications()

    const participants = applications.map(app => ({
        id: app.id,
        fullName: app.fullName,
        email: app.email,
        category: app.category,
        status: app.status
    }))

    return <BulkEmailSender participants={participants} />
}
