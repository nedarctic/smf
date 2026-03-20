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
      data: { companyId: company.id, categoryName: "Harassment" },
    }),
    prisma.category.create({
      data: { companyId: company.id, categoryName: "Fraud" },
    }),
    prisma.category.create({
      data: { companyId: company.id, categoryName: "Safety Violation" },
    }),
  ]);

  // =========================
  // INCIDENTS (10 total)
  // =========================
  const incident1 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-001",
      category: categories[0].categoryName,
      description: "Manager verbally harassed employee during meeting.",
      location: "Nairobi HQ",
      involvedPeople: "Manager A, Employee B",
      incidentDate: new Date("2026-03-18"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.InReview,
      secretCodeHash: await bcrypt.hash("secret123", 10),
      deadlineAt: new Date("2026-03-25"),
    },
  });

  const incident2 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-002",
      category: categories[1].categoryName,
      description: "Suspicious financial transactions detected.",
      location: "Finance Department",
      incidentDate: new Date("2026-03-15"),
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
      incidentDate: new Date("2026-03-10"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.Resolved,
      secretCodeHash: await bcrypt.hash("secret789", 10),
      closedAt: new Date("2026-03-13"),
      duration: "3 days",
    },
  });

  const incident4 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-004",
      category: categories[0].categoryName,
      description: "Inappropriate comments in team chat.",
      location: "Remote",
      incidentDate: new Date("2026-03-05"),
      reporterType: ReporterType.Anonymous,
      status: IncidentStatus.InReview,
      secretCodeHash: await bcrypt.hash("secret004", 10),
    },
  });

  const incident5 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-005",
      category: categories[1].categoryName,
      description: "Expense fraud suspected.",
      location: "Accounts",
      incidentDate: new Date("2026-02-28"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.Investigation,
      secretCodeHash: await bcrypt.hash("secret005", 10),
    },
  });

  const incident6 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-006",
      category: categories[2].categoryName,
      description: "Fire exit blocked.",
      location: "Factory Floor",
      incidentDate: new Date("2026-02-20"),
      reporterType: ReporterType.Anonymous,
      status: IncidentStatus.Resolved,
      secretCodeHash: await bcrypt.hash("secret006", 10),
      closedAt: new Date("2026-02-22"),
      duration: "2 days",
    },
  });

  const incident7 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-007",
      category: categories[0].categoryName,
      description: "Bullying reported by junior staff.",
      location: "HR Office",
      incidentDate: new Date("2026-02-15"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.InReview,
      secretCodeHash: await bcrypt.hash("secret007", 10),
    },
  });

  const incident8 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-008",
      category: categories[1].categoryName,
      description: "Unauthorized vendor payments.",
      location: "Finance",
      incidentDate: new Date("2026-02-10"),
      reporterType: ReporterType.Anonymous,
      status: IncidentStatus.Resolved,
      secretCodeHash: await bcrypt.hash("secret008", 10),
      closedAt: new Date("2026-02-14"),
      duration: "4 days",
    },
  });

  const incident9 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-009",
      category: categories[2].categoryName,
      description: "Lack of protective gear.",
      location: "Construction Site",
      incidentDate: new Date("2026-02-05"),
      reporterType: ReporterType.Confidential,
      status: IncidentStatus.Investigation,
      secretCodeHash: await bcrypt.hash("secret009", 10),
    },
  });

  const incident10 = await prisma.incident.create({
    data: {
      companyId: company.id,
      incidentIdDisplay: "INC-010",
      category: categories[0].categoryName,
      description: "Discrimination complaint filed.",
      location: "Head Office",
      incidentDate: new Date("2026-01-30"),
      reporterType: ReporterType.Anonymous,
      status: IncidentStatus.Resolved,
      secretCodeHash: await bcrypt.hash("secret010", 10),
      closedAt: new Date("2026-02-03"),
      duration: "4 days",
    },
  });

  // =========================
  // REPORTERS (kept consistent + expanded)
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

  await prisma.reporter.create({
    data: {
      incidentId: incident5.id,
      name: "Carol Reporter",
      email: "carol@example.com",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident7.id,
      name: "David Reporter",
      email: "david@example.com",
    },
  });

  // =========================
  // INCIDENT HANDLERS
  // =========================
  await prisma.incidentHandler.createMany({
    data: [
      { incidentId: incident1.id, handlerId: handler1.id },
      { incidentId: incident2.id, handlerId: handler2.id },
      { incidentId: incident3.id, handlerId: handler1.id },
      { incidentId: incident4.id, handlerId: handler2.id },
      { incidentId: incident5.id, handlerId: handler1.id },
      { incidentId: incident6.id, handlerId: handler2.id },
      { incidentId: incident7.id, handlerId: handler1.id },
      { incidentId: incident8.id, handlerId: handler2.id },
      { incidentId: incident9.id, handlerId: handler1.id },
      { incidentId: incident10.id, handlerId: handler2.id },
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
      {
        incidentId: incident4.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "chat_log.txt",
        filePath: "/uploads/chat_log.txt",
      },
    ],
  });

  // =========================
  // SECRET CODES
  // =========================
  await prisma.secretCode.createMany({
    data: [
      { incidentId: incident1.id, secretCodeHash: await bcrypt.hash("secret123", 10) },
      { incidentId: incident2.id, secretCodeHash: await bcrypt.hash("secret456", 10) },
      { incidentId: incident3.id, secretCodeHash: await bcrypt.hash("secret789", 10) },
    ],
  });

  // =========================
  // MESSAGES
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
      {
        incidentId: incident5.id,
        senderType: SenderType.Handler,
        senderId: handler1.id,
        content: "We are reviewing financial records.",
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