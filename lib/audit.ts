import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "ASSIGN"
  | "STATUS_CHANGE"
  | "SEND_MESSAGE"
  | "UPLOAD_FILE";

type AuditEntity =
  | "COMPANY"
  | "USER"
  | "INCIDENT"
  | "MESSAGE"
  | "ATTACHMENT"
  | "CATEGORY"
  | "REPORTING_PAGE";

type LogAuditParams = {
  action: AuditAction;
  entityType: AuditEntity;
  entityId?: string;
  userId?: string | null;
  companyId?: string | null;
  incidentId?: string | null;
  description?: string;
  metadata?: Prisma.InputJsonValue;
};

// Blocking (use for critical operations or inside transactions)

export async function logAudit(params: LogAuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        ...params,
        userId: params.userId ?? null,
        companyId: params.companyId ?? null,
        incidentId: params.incidentId ?? null,
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}

// Non-blocking

export function logAuditAsync(params: LogAuditParams) {
  void prisma.auditLog
    .create({
      data: {
        ...params,
        userId: params.userId ?? null,
        companyId: params.companyId ?? null,
        incidentId: params.incidentId ?? null,
      },
    })
    .catch((err) => {
      console.error("Audit log failed:", err);
    });
}