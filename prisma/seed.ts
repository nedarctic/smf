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

  const incident1 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-01",
    category: categories[0].categoryName,
    description: "Heated argument between staff escalated.",
    location: "Nairobi HQ",
    incidentDate: new Date("2026-03-18"),
    createdAt: new Date("2026-03-18T08:15:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.InReview,
    secretCodeHash: await bcrypt.hash("secret011", 10),
  },
});

const incident2 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-02",
    category: categories[1].categoryName,
    description: "Duplicate payments flagged.",
    location: "Finance Department",
    incidentDate: new Date("2026-03-18"),
    createdAt: new Date("2026-03-18T11:42:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret012", 10),
  },
});

const incident3 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-03",
    category: categories[2].categoryName,
    description: "Loose wiring near workstation.",
    location: "Warehouse",
    incidentDate: new Date("2026-03-17"),
    createdAt: new Date("2026-03-17T09:05:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret013", 10),
    closedAt: new Date("2026-03-18T10:30:00"),
    duration: "1 day",
  },
});

const incident4 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-04",
    category: categories[0].categoryName,
    description: "Offensive language reported.",
    location: "Remote",
    incidentDate: new Date("2026-03-15"),
    createdAt: new Date("2026-03-15T07:55:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.InReview,
    secretCodeHash: await bcrypt.hash("secret014", 10),
  },
});

const incident5 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-05",
    category: categories[1].categoryName,
    description: "Irregular expense claims.",
    location: "Accounts",
    incidentDate: new Date("2026-03-15"),
    createdAt: new Date("2026-03-15T14:20:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret015", 10),
  },
});

const incident6 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-06",
    category: categories[2].categoryName,
    description: "Spill hazard not cleaned.",
    location: "Factory Floor",
    incidentDate: new Date("2026-03-14"),
    createdAt: new Date("2026-03-14T10:10:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret016", 10),
    closedAt: new Date("2026-03-16T09:00:00"),
    duration: "2 days",
  },
});

const incident7 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-07",
    category: categories[0].categoryName,
    description: "Workplace intimidation reported.",
    location: "HR Office",
    incidentDate: new Date("2026-03-12"),
    createdAt: new Date("2026-03-12T13:30:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.InReview,
    secretCodeHash: await bcrypt.hash("secret017", 10),
  },
});

const incident8 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-08",
    category: categories[1].categoryName,
    description: "Unverified supplier invoices.",
    location: "Finance",
    incidentDate: new Date("2026-03-10"),
    createdAt: new Date("2026-03-10T08:45:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret018", 10),
    closedAt: new Date("2026-03-13T12:00:00"),
    duration: "3 days",
  },
});

const incident9 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-09",
    category: categories[2].categoryName,
    description: "Missing safety gloves.",
    location: "Construction Site",
    incidentDate: new Date("2026-03-10"),
    createdAt: new Date("2026-03-10T15:25:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret019", 10),
  },
});

const incident10 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-10",
    category: categories[0].categoryName,
    description: "Disrespectful remarks in meeting.",
    location: "Head Office",
    incidentDate: new Date("2026-03-08"),
    createdAt: new Date("2026-03-08T11:05:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret020", 10),
    closedAt: new Date("2026-03-11T10:00:00"),
    duration: "3 days",
  },
});

const incident11 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-11",
    category: categories[1].categoryName,
    description: "Unauthorized transaction flagged.",
    location: "Finance Department",
    incidentDate: new Date("2026-03-05"),
    createdAt: new Date("2026-03-05T09:15:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret021", 10),
  },
});

const incident12 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-12",
    category: categories[2].categoryName,
    description: "Broken ladder reported.",
    location: "Warehouse",
    incidentDate: new Date("2026-03-05"),
    createdAt: new Date("2026-03-05T16:40:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret022", 10),
    closedAt: new Date("2026-03-07T10:00:00"),
    duration: "2 days",
  },
});

const incident13 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-13",
    category: categories[0].categoryName,
    description: "Harassment claim filed.",
    location: "Nairobi HQ",
    incidentDate: new Date("2026-02-28"),
    createdAt: new Date("2026-02-28T12:10:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.InReview,
    secretCodeHash: await bcrypt.hash("secret023", 10),
  },
});

const incident14 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-14",
    category: categories[1].categoryName,
    description: "Expense anomalies detected.",
    location: "Accounts",
    incidentDate: new Date("2026-02-28"),
    createdAt: new Date("2026-02-28T15:55:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret024", 10),
  },
});

const incident15 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-15",
    category: categories[2].categoryName,
    description: "Slippery floor hazard.",
    location: "Factory Floor",
    incidentDate: new Date("2026-02-20"),
    createdAt: new Date("2026-02-20T07:50:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret025", 10),
    closedAt: new Date("2026-02-22T08:30:00"),
    duration: "2 days",
  },
});

const incident16 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-16",
    category: categories[0].categoryName,
    description: "Bullying concern raised.",
    location: "HR Office",
    incidentDate: new Date("2026-02-15"),
    createdAt: new Date("2026-02-15T10:25:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.InReview,
    secretCodeHash: await bcrypt.hash("secret026", 10),
  },
});

const incident17 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-17",
    category: categories[1].categoryName,
    description: "Unapproved vendor payment.",
    location: "Finance",
    incidentDate: new Date("2026-02-10"),
    createdAt: new Date("2026-02-10T13:10:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret027", 10),
    closedAt: new Date("2026-02-14T11:00:00"),
    duration: "4 days",
  },
});

const incident18 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-18",
    category: categories[2].categoryName,
    description: "Missing helmets on site.",
    location: "Construction Site",
    incidentDate: new Date("2026-02-05"),
    createdAt: new Date("2026-02-05T08:05:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret028", 10),
  },
});

const incident19 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-19",
    category: categories[0].categoryName,
    description: "Discrimination issue reported.",
    location: "Head Office",
    incidentDate: new Date("2026-01-30"),
    createdAt: new Date("2026-01-30T09:00:00"),
    reporterType: ReporterType.Anonymous,
    status: IncidentStatus.Resolved,
    secretCodeHash: await bcrypt.hash("secret029", 10),
    closedAt: new Date("2026-02-03T10:00:00"),
    duration: "4 days",
  },
});

const incident20 = await prisma.incident.create({
  data: {
    companyId: company.id,
    incidentIdDisplay: "INC-20",
    category: categories[1].categoryName,
    description: "Suspicious ledger changes.",
    location: "Finance Department",
    incidentDate: new Date("2026-03-02"),
    createdAt: new Date("2026-03-02T14:45:00"),
    reporterType: ReporterType.Confidential,
    status: IncidentStatus.Investigation,
    secretCodeHash: await bcrypt.hash("secret030", 10),
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

  await prisma.reporter.create({
    data: {
      incidentId: incident9.id,
      name: "Jared Reporter",
      email: "jared@example.com",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident11.id,
      name: "Sheila Reporter",
      email: "sheila@example.com",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident13.id,
      name: "Milca Reporter",
      email: "milca@example.com",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident15.id,
      name: "Arthur Reporter",
      email: "arthur@example.com",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident17.id,
      name: "Martin Reporter",
      email: "martin@example.com",
    },
  });

  await prisma.reporter.create({
    data: {
      incidentId: incident19.id,
      name: "Osbon Reporter",
      email: "osbon@example.com",
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
      { incidentId: incident11.id, handlerId: handler1.id },
      { incidentId: incident12.id, handlerId: handler2.id },
      { incidentId: incident13.id, handlerId: handler1.id },
      { incidentId: incident14.id, handlerId: handler2.id },
      { incidentId: incident15.id, handlerId: handler1.id },
      { incidentId: incident16.id, handlerId: handler2.id },
      { incidentId: incident17.id, handlerId: handler1.id },
      { incidentId: incident18.id, handlerId: handler2.id },
      { incidentId: incident19.id, handlerId: handler1.id },
      { incidentId: incident20.id, handlerId: handler2.id },
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
        fileName: "report1.pdf",
        filePath: "/uploads/report1.pdf",
      },
      {
        incidentId: incident4.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "chat_log1.txt",
        filePath: "/uploads/chat_log1.txt",
      },
      {
        incidentId: incident7.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "evidence2.jpg",
        filePath: "/uploads/evidence2.jpg",
      },
      {
        incidentId: incident9.id,
        uploadedBy: AttachmentUploader.Handler,
        fileName: "report2.pdf",
        filePath: "/uploads/report2.pdf",
      },
      {
        incidentId: incident11.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "chat_log2.txt",
        filePath: "/uploads/chat_log2.txt",
      },
      {
        incidentId: incident13.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "evidence3.jpg",
        filePath: "/uploads/evidence3.jpg",
      },
      {
        incidentId: incident15.id,
        uploadedBy: AttachmentUploader.Handler,
        fileName: "report3.pdf",
        filePath: "/uploads/report3.pdf",
      },
      {
        incidentId: incident17.id,
        uploadedBy: AttachmentUploader.Reporter,
        fileName: "chat_log3.txt",
        filePath: "/uploads/chat_log3.txt",
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
      { incidentId: incident4.id, secretCodeHash: await bcrypt.hash("secret101112", 10) },
      { incidentId: incident5.id, secretCodeHash: await bcrypt.hash("secret131415", 10) },
      { incidentId: incident6.id, secretCodeHash: await bcrypt.hash("secret161718", 10) },
      { incidentId: incident7.id, secretCodeHash: await bcrypt.hash("secret192021", 10) },
      { incidentId: incident8.id, secretCodeHash: await bcrypt.hash("secret222324", 10) },
      { incidentId: incident9.id, secretCodeHash: await bcrypt.hash("secret252627", 10) },
      { incidentId: incident10.id, secretCodeHash: await bcrypt.hash("secret282930", 10) },
      { incidentId: incident11.id, secretCodeHash: await bcrypt.hash("secret313233", 10) },
      { incidentId: incident12.id, secretCodeHash: await bcrypt.hash("secret343536", 10) },
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