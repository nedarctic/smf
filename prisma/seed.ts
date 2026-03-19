import {
  IncidentStatus,
  ReporterType,
  UserRole,
  UserStatus,
  AttachmentUploader,
  SenderType,
} from "@/lib/generated/prisma/enums";

import bcrypt from "bcrypt";
import { prisma } from '@/lib/prisma';

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // =========================
  // COMPANY
  // =========================
  const company = await prisma.company.create({
    data: {
      name: "Acme Corp",
      reportingLinkSlug: "acme-report",
    },
  });

  // =========================
  // USERS
  // =========================
  const admin = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Admin User",
      email: "admin@acme.com",
      password: passwordHash,
      role: UserRole.Admin,
      status: UserStatus.Active,
    },
  });

  const handler1 = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Jane Handler",
      email: "jane@acme.com",
      password: passwordHash,
      role: UserRole.Handler,
      status: UserStatus.Active,
    },
  });

  const handler2 = await prisma.user.create({
    data: {
      companyId: company.id,
      name: "John Handler",
      email: "john@acme.com",
      password: passwordHash,
      role: UserRole.Handler,
      status: UserStatus.Active,
    },
  });

  // =========================
  // CATEGORIES
  // =========================
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        companyId: company.id,
        categoryName: "Harassment",
      },
    }),
    prisma.category.create({
      data: {
        companyId: company.id,
        categoryName: "Fraud",
      },
    }),
    prisma.category.create({
      data: {
        companyId: company.id,
        categoryName: "Safety Violation",
      },
    }),
  ]);

  // =========================
  // INCIDENTS
  // =========================
  const incident1 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-001",
      category: categories[0].categoryName,
      description: "Manager verbally harassed employee during meeting.",
      location: "Nairobi HQ",
      involvedPeople: "Manager A, Employee B",
      incidentDate: new Date("2025-02-10"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.InReview,
      secretCodeHash: await bcrypt.hash("secret123", 10),
      deadlineAt: new Date("2025-02-20"),
    },
  });

  const incident2 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-002",
      category: categories[1].categoryName,
      description: "Suspicious financial transactions detected.",
      location: "Finance Department",
      incidentDate: new Date("2025-01-15"),
      reporterType: ReporterType.Anonymous,
      status: IncidentStatus.Investigation,
      secretCodeHash: await bcrypt.hash("secret456", 10),
    },
  });

  const incident3 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-003",
      category: categories[2].categoryName,
      description: "Unsafe equipment used on site.",
      location: "Warehouse",
      incidentDate: new Date("2025-01-05"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.Resolved,
      secretCodeHash: await bcrypt.hash("secret789", 10),
      closedAt: new Date(),
      duration: "3 days",
    },
  });

  // =========================
  // REPORTERS
  // =========================
  await prisma.reporter.create({
    data: {
      incidentId: incident1.id,
      name: "Alice Reporter",
      email: "alice@example.com",
      phone: "+254700000001",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident3.id,
      name: "Bob Reporter",
      email: "bob@example.com",
    },
  });

  // =========================
  // INCIDENT HANDLERS
  // =========================
  await prisma.incidentHandler.createMany({
    data: [
      {
        incidentId: incident1.id,
        handlerId: handler1.id,
      },
      {
        incidentId: incident2.id,
        handlerId: handler2.id,
      },
      {
        incidentId: incident3.id,
        handlerId: handler1.id,
      },
    ],
  });

  // =========================
  // ATTACHMENTS
  // =========================
  await prisma.attachment.createMany({
    data: [
      {
        incidentId: incident1.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "evidence1.jpg",
        filePath: "/uploads/evidence1.jpg",
      },
      {
        incidentId: incident2.id,
        uploadedBy: AttachmentUploader.Handler,
        fileName: "report.pdf",
        filePath: "/uploads/report.pdf",
      },
    ],
  });

  // =========================
  // SECRET CODES
  // =========================
  await prisma.secretCode.createMany({
    data: [
      {
        incidentId: incident1.id,
        secretCodeHash: await bcrypt.hash("secret123", 10),
      },
      {
        incidentId: incident2.id,
        secretCodeHash: await bcrypt.hash("secret456", 10),
      },
    ],
  });

  // =========================
  // MESSAGES (CHAT THREAD)
  // =========================
  await prisma.message.createMany({
    data: [
      {
        incidentId: incident1.id,
        senderType: SenderType.Handler,
        senderId: handler1.id,
        content: "We have received your report and are reviewing it.",
      },
      {
        incidentId: incident1.id,
        senderType: SenderType.Handler,
        senderId: handler1.id,
        content: "Can you provide more details?",
      },
      {
        incidentId: incident2.id,
        senderType: SenderType.Handler,
        senderId: handler2.id,
        content: "Investigation has started.",
      },
    ],
  });

  // =========================
  // REPORTING PAGE
  // =========================
  await prisma.reportingPage.create({
    data: {
      companyId: company.id,
      title: "Report an Incident",
      introContent: "Submit your concerns confidentially.",
      policyUrl: "https://acme.com/policy",
      reportingPageUrl: "https://acme.com/report",
    },
  });

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });