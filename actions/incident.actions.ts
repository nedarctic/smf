"use server"

import { prisma } from '@/lib/prisma';
import { Incident, IncidentStatus } from '@/lib/generated/prisma/client';
import { transporter } from '@/lib/mailer';

export async function deleteIncident(incident: Incident) {
  try {
    await prisma.incident.delete({
      where: { id: incident.id }
    });
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof
        Error ? error.message :
        "Unknown error"
    }
  }
}

export async function updateHandlers(
  incident: Incident,
  handlerIds: string[]
) {
  try {
    // Remove existing handlers
    await prisma.incidentHandler.deleteMany({
      where: { incidentId: incident.id },
    });

    // Insert all selected handlers
    await prisma.incidentHandler.createMany({
      data: handlerIds.map((id) => ({
        incidentId: incident.id,
        handlerId: id,
      })),
    })

    // fetch the handlers
    const handlers = await prisma.user.findMany({
      where: { id: { in: handlerIds } },
      select: { email: true }
    })

    // send the handlers emails in parallel
    Promise.all(handlers.map(({ email }) => {
      transporter.sendMail({
        from: `"SemaFacts" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Incident Assigned",
        html: `<p>You have been assigned an incident.</p>`,
      })
    }))

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}

export async function updateIncidentStatus(
  incident: Incident,
  status: IncidentStatus
) {
  try {
    await prisma.incident.update({
      where: { id: incident.id },
      data: {
        status,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}

export async function updateIncidentDeadline(
  incident: Incident,
  deadlineAt: Date
) {
  try {
    await prisma.incident.update({
      where: { id: incident.id },
      data: {
        deadlineAt,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}

export async function closeIncident(
  incident: Incident
) {
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

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}
