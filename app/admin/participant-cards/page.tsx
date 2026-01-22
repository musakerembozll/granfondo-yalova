import { ParticipantCardGenerator } from "@/components/admin/participant-card-generator"
import { getApplications } from "@/app/actions"

export default async function ParticipantCardsPage() {
    const applications = await getApplications()

    const participants = applications.map(app => ({
        id: app.id,
        fullName: app.fullName,
        email: app.email,
        category: app.category,
        status: app.status
    }))

    return <ParticipantCardGenerator participants={participants} />
}
