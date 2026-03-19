import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";

export async function getCompanyId() {
  try {
    // 1. get user id from session
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    console.log("user id:", userId);

    // 2. get company user object and destructure company id
    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    const { companyId } = user!;

    console.log("company id", companyId)

    return { success: true, data: companyId };
  } catch (error) {
    return { error: error instanceof Error ? error.message.toString() : "Unknown error" }
  }
}

export async function totalIncidents(companyId: string) {
    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });
    return data.length;
}

export async function totalOpenIncidents(companyId: string) {
    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });
    const openIncidents = data.filter((incident) => incident.status !== "Closed");
    return openIncidents.length;
}

export async function totalOverdueIncidents(companyId: string) {
    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });
    const overdueIncidents = data.filter((incident) => {
        return new Date(incident.deadlineAt!).getTime() < Date.now()
    })
    return overdueIncidents.length;
}

export async function totalIncidentsDueSoon(companyId: string, days: number) {

    let now = Date.now();
    const limit = now + days * 24 * 60 * 60 * 1000;

    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });

    const incidentsDueSoon = data.filter(({ deadlineAt }) => {
        const deadline = new Date(deadlineAt!).getTime();
        return deadline > now && deadline < limit;
    });

    return incidentsDueSoon.length;
}

export async function SLACompliance(companyId: string) {

    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });
    // get closed incidents
    const closed = data.filter(({ closedAt }) => closedAt !== null);

    if (closed.length === 0) return 0;

    // filter those that were closed before deadline
    const within_SLA = closed.filter(({ deadlineAt, closedAt }) => {
        const deadline = new Date(deadlineAt!).getTime();
        const closed = new Date(closedAt!).getTime();
        return closed <= deadline;
    }).length;

    // return percentage of SLA compliance
    return Math.round((within_SLA / data.length) * 100);
}

export async function unassignedIncidents(companyId: string) {

    const data = await prisma.incident.findMany({
        where: { companyId: companyId },
        include: { handlers: true }
    });

    return Array.from(data.filter(incident => {
        return incident.handlers.length === null;
    }));
}

export async function incidentsDueSoon(companyId: string, days: number) {

    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });

    return Array.from(data.filter(({ deadlineAt }) => {
        const deadline = new Date(deadlineAt!).getTime();
        const now = Date.now();
        const limit = Date.now() * days * 24 * 60 * 60 * 1000;
        return deadline > now && limit > deadline;
    }));
}

export async function overdueIncidents(companyId: string) {
    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });
    const overdueIncidents = data.filter((incident) => {
        return new Date(incident.deadlineAt!).getTime() < Date.now()
    })
    return overdueIncidents;
}

