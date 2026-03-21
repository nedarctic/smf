import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";
import { DbNull } from "@prisma/client/runtime/client";


function getDateRanges(days: number) {
    const now = new Date()

    const currentStart = new Date(now)
    currentStart.setDate(now.getDate() - days)

    const previousStart = new Date(currentStart)
    previousStart.setDate(currentStart.getDate() - days)

    return { now, currentStart, previousStart }
}

export async function getIncidents(
    companyId: string,
    options?: {
        startDate?: Date
        endDate?: Date
        limit?: number
        offset?: number
    }
) {
    const { startDate, endDate, limit, offset } = options || {}

    return prisma.incident.findMany({
        where: {
            companyId,
            ...(startDate || endDate
                ? {
                    createdAt: {
                        ...(startDate ? { gte: startDate } : {}),
                        ...(endDate ? { lt: endDate } : {}),
                    },
                }
                : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        ...(limit !== undefined ? { take: limit } : {}),
        ...(offset !== undefined ? { skip: offset } : {}),
    })
}


export async function totalIncidentsTrend(companyId: string, days = 30) {
    const { now, currentStart, previousStart } = getDateRanges(days)

    const current = await prisma.incident.count({
        where: {
            companyId,
            createdAt: { gte: currentStart, lt: now },
        },
    })

    console.log("current inside total incidents trend:", current)

    const previous = await prisma.incident.count({
        where: {
            companyId,
            createdAt: { gte: previousStart, lt: currentStart },
        },
    })

    return { current, previous }
}

export async function totalOpenIncidentsTrend(companyId: string, days = 30) {
    const { currentStart, previousStart, now } = getDateRanges(days)

    const [current, previous] = await Promise.all([
        prisma.incident.count({
            where: {
                companyId,
                status: { not: "Closed" },
                createdAt: { gte: currentStart, lt: now },
            },
        }),
        prisma.incident.count({
            where: {
                companyId,
                status: { not: "Closed" },
                createdAt: { gte: previousStart, lt: currentStart },
            },
        }),
    ])

    return { current, previous }
}

export async function slaComplianceTrend(companyId: string, days = 30) {
    const { now, currentStart, previousStart } = getDateRanges(days)

    async function compute(start: Date, end: Date) {
        const incidents = await prisma.incident.findMany({
            where: {
                companyId,
                createdAt: { gte: start, lt: end },
            },
        })

        const closed = incidents.filter(i => i.closedAt)

        if (closed.length === 0) return 0

        const withinSLA = closed.filter(i => {
            const deadline = new Date(i.deadlineAt!).getTime()
            const closedAt = new Date(i.closedAt!).getTime()
            return closedAt <= deadline
        }).length

        return Math.round((withinSLA / incidents.length) * 100)
    }

    const current = await compute(currentStart, now)
    const previous = await compute(previousStart, currentStart)

    return { current, previous }
}

export async function avgResolutionTimeTrend(companyId: string, days = 30) {
    const { now, currentStart, previousStart } = getDateRanges(days)

    async function compute(start: Date, end: Date) {
        const incidents = await prisma.incident.findMany({
            where: {
                companyId,
                createdAt: { gte: start, lt: end },
                closedAt: { not: null },
            },
        })

        if (incidents.length === 0) return 0

        const total = incidents.reduce((sum, i) => {
            const created = new Date(i.createdAt).getTime()
            const closed = new Date(i.closedAt!).getTime()
            return sum + (closed - created)
        }, 0)

        const avgMs = total / incidents.length

        return Math.round(avgMs / (1000 * 60 * 60 * 24))
    }

    const current = await compute(currentStart, now)
    const previous = await compute(previousStart, currentStart)

    return { current, previous }
}


export async function getCompanyId() {
    try {
        // 1. get user id from session
        const session = await getServerSession(authOptions);
        const userId = session?.user.id;

        // 2. get company user object and destructure company id
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const { companyId } = user!;

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
        return incident.handlers.length === 0;
    }));
}

export async function incidentsDueSoon(companyId: string, days: number) {

    const data = await prisma.incident.findMany({
        where: { companyId: companyId }
    });

    return Array.from(data.filter(({ deadlineAt }) => {
        const deadline = new Date(deadlineAt!).getTime();
        const now = Date.now();
        const limit = now + days * 24 * 60 * 60 * 1000;
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

export async function avgResolutionTime(companyId: string): Promise<number> {
    const data = await prisma.incident.findMany({
        where: { companyId },
    })

    const closed = data.filter((i) => i.closedAt)

    if (closed.length === 0) return 0

    const totalResolutionTimeMs = closed.reduce((sum, incident) => {
        const start = new Date(incident.incidentDate).getTime()
        const end = new Date(incident.closedAt!).getTime()

        if (end < start) return sum // guard

        return sum + (end - start)
    }, 0)

    const avgMs = totalResolutionTimeMs / closed.length
    const avgDays = avgMs / (1000 * 60 * 60 * 24)

    return Math.round(avgDays)
}

export function getTrend(current: number, previous: number, invert = false) {
    if (previous === 0) {
        return { percent: "0.0", isUp: true }
    }

    let change = ((current - previous) / previous) * 100

    if (invert) change = -change

    return {
        percent: Math.abs(change).toFixed(1), // always string
        isUp: change >= 0,
    }
}

export function getFooterText(
    label: string,
    trend: { isUp: boolean; percent: string },
    options?: { invert?: boolean }
) {
    const { isUp, percent } = trend
    const directionUp = options?.invert ? !isUp : isUp

    const directionText = directionUp ? "increased" : "decreased"

    return `${label} ${directionText} by ${percent}%`
}


export function groupIncidentsByDate(incidents: { createdAt: Date }[]) {
    const map = new Map<string, number>()

    for (const incident of incidents) {
        const date = incident.createdAt.toISOString().split("T")[0] // YYYY-MM-DD

        map.set(date, (map.get(date) || 0) + 1)
    }

    return Array.from(map.entries()).map(([date, count]) => ({
        date,
        incidents: count,
    }))
}

export async function getPaginatedIncidents({
    query,
    sort,
    page = 1,
    pageSize = 5,
}: {
    query?: string;
    sort?: "date" | "category" | "unassigned";
    page?: number;
    pageSize?: number;
} = {}) {

    const res = await getCompanyId();
    const companyId = res.data;

    const incidents = await prisma.incident.findMany({
        where: { companyId: companyId },
        include: {handlers: true},
        orderBy: {createdAt: "desc"}
    });

    let filtered = incidents.filter(incident => {
        if (!query) return true;

        if (query === "resolved") {
            return incident.status === "Resolved"
        }

        if (query === "unassigned") {
            return incident.handlers.length === 0;
        }

        return incident.description
            .toLowerCase()
            .includes(query.toLowerCase()) ||
            incident.category
                .toLowerCase()
                .includes(query.toLowerCase()) ||
            incident.status
                .toLowerCase()
                .includes(query.toLowerCase())
    });

    if (sort) {
        filtered = [...filtered].sort((a, b) => {
            return sort === "category" ? a.category
                .localeCompare(b.category) : a.createdAt.getTime() -
            b.createdAt.getTime();
        })
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
        data: paginated,
        total,
        totalPages: Math.ceil(total / pageSize)
    }
}

export async function getIncidentDetails (incidentId: string) {
    const incident = await prisma.incident.findUnique({
        where: {id: incidentId},
        include: {handlers: true}
    });

    return incident;
}

export async function getHandlers () {
    const res = await getCompanyId();
    const companyId = res.data;

    const handlers = await prisma.user.findMany({
        where: {companyId: companyId, role: "Handler"},
    })

    return handlers;
}

export async function getIncidentHandler (handlerId: string) {
    const handler = await prisma.user.findUnique({
        where: {id: handlerId}
    });
    return handler;
}