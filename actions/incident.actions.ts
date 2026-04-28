"use server";

import { prisma } from "@/lib/prisma";
import { Incident, IncidentStatus } from "@/lib/generated/prisma/client";
import { transporter } from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logAuditAsync } from "@/lib/audit";

// 🔹 Get current user once (cleaner + safer)
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { userId: null, username: "Unknown User" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  return {
    userId: session.user.id,
    username: user?.name || "Unknown User",
  };
}

// 🔴 DELETE INCIDENT
export async function deleteIncident(incident: Incident) {
  const { userId } = await getCurrentUser();

  try {
    await prisma.incident.delete({
      where: { id: incident.id },
    });

    logAuditAsync({
      action: "DELETE",
      entityType: "INCIDENT",
      entityId: incident.id,
      incidentId: incident.id,
      userId,
      companyId: incident.companyId,
      description: "Incident deleted",
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 🟡 UPDATE HANDLERS
export async function updateHandlers(
  incident: Incident,
  handlerIds: string[]
) {
  const { userId } = await getCurrentUser();

  try {
    const previous = await prisma.incidentHandler.findMany({
      where: { incidentId: incident.id },
      select: { handlerId: true },
    });

    const previousIds = previous.map((h) => h.handlerId);

    await prisma.incidentHandler.deleteMany({
      where: { incidentId: incident.id },
    });

    await prisma.incidentHandler.createMany({
      data: handlerIds.map((id) => ({
        incidentId: incident.id,
        handlerId: id,
      })),
    });

    const handlers = await prisma.user.findMany({
      where: { id: { in: handlerIds } },
      select: { email: true },
    });

    // ⚠️ FIX: ensure Promise is handled
    await Promise.all(
      handlers.map(({ email }) =>
        transporter.sendMail({
          from: `"SemaFacts" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Incident Assigned",
          html: `<p>You have been assigned an incident.</p>`,
        })
      )
    );

    logAuditAsync({
      action: "ASSIGN",
      entityType: "INCIDENT",
      entityId: incident.id,
      incidentId: incident.id,
      userId,
      companyId: incident.companyId,
      description: "Handlers updated",
      metadata: {
        before: previousIds,
        after: handlerIds,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 🔵 UPDATE STATUS
export async function updateIncidentStatus(
  incident: Incident,
  status: IncidentStatus
) {
  const { userId } = await getCurrentUser();

  try {
    const previousStatus = incident.status;

    await prisma.incident.update({
      where: { id: incident.id },
      data: { status },
    });

    logAuditAsync({
      action: "STATUS_CHANGE",
      entityType: "INCIDENT",
      entityId: incident.id,
      incidentId: incident.id,
      userId,
      companyId: incident.companyId,
      description: "Incident status updated",
      metadata: {
        from: previousStatus,
        to: status,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 🟣 UPDATE DEADLINE
export async function updateIncidentDeadline(
  incident: Incident,
  deadlineAt: Date
) {
  const { userId } = await getCurrentUser();

  try {
    const previous = incident.deadlineAt;

    await prisma.incident.update({
      where: { id: incident.id },
      data: { deadlineAt },
    });

    logAuditAsync({
      action: "UPDATE",
      entityType: "INCIDENT",
      entityId: incident.id,
      incidentId: incident.id,
      userId,
      companyId: incident.companyId,
      description: "Deadline updated",
      metadata: {
        from: previous,
        to: deadlineAt,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 🟢 CLOSE INCIDENT
export async function closeIncident(incident: Incident) {
  const { userId } = await getCurrentUser();

  try {
    if (incident.status === IncidentStatus.Closed) {
      return { error: "Incident already closed" };
    }

    await prisma.incident.update({
      where: { id: incident.id },
      data: {
        status: IncidentStatus.Closed,
        closedAt: new Date(),
      },
    });

    logAuditAsync({
      action: "STATUS_CHANGE",
      entityType: "INCIDENT",
      entityId: incident.id,
      incidentId: incident.id,
      userId,
      companyId: incident.companyId,
      description: "Incident closed",
      metadata: {
        from: incident.status,
        to: "Closed",
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}