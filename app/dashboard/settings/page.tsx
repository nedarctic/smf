import SettingsClient from "./SettingsClient";
import { getCompanyId } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/incidents/[incidentId]/route";

export default async function SettingsPage() {

    const companyId = await getCompanyId()
        .then(cp => cp.data!);

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const company = await prisma.company.findUnique({
        where: { id: companyId }
    })

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    return (
        <SettingsClient
            company={company}
            userEmail={user?.email!}
            userName={user?.name!}
        />
    )
}