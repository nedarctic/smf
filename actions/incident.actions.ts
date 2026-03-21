"use server"

import { prisma } from '@/lib/prisma';
import { Incident, IncidentStatus } from '@/lib/generated/prisma/client';
import { User } from '@/lib/generated/prisma/client';

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

export async function updateHandler(
  incident: Incident,
  handler: User
) {
  try {
    // Optional: clear existing handlers (if you want single-handler system)
    await prisma.incidentHandler.deleteMany({
      where: { incidentId: incident.id }
    });

    // Assign new handler
    await prisma.incidentHandler.create({
      data: {
        incidentId: incident.id,
        handlerId: handler.id,
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
