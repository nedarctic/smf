import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

import IncidentChat from "@/components/incident/IncidentChat";
import IncidentEvidence from "@/components/incident/IncidentEvidence";
import IncidentOverview from "@/components/incident/IncidentOverview";

/* -----------------------------
 * Data fetchers (Prisma)
 * ----------------------------- */

export async function getIncident(incidentId: string) {
  return prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      reporter: true, // ✅ needed for senderId
    },
  });
}

export async function getAttachments(incidentId: string) {
  return prisma.attachment.findMany({
    where: { incidentId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInitialMessages(incidentId: string) {
  const initialMessages = await prisma.message.findMany({
    where: { incidentId },
    orderBy: { createdAt: "asc" },
  });
  console.log("Initial messages at the helper:", initialMessages);
  return initialMessages;
}

/* -----------------------------
 * Page
 * ----------------------------- */

export default async function TrackIncidentPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.type !== "incident") {
    redirect("https://www.semafacts.com");
  }

  const incidentId = session.incidentId as string;

  const incident = await getIncident(incidentId);
  if (!incident) return notFound();

  const attachments = await getAttachments(incidentId);
  const initialMessages = await getInitialMessages(incidentId);

  console.log("Initial messages at the server component:", initialMessages)
  /* -----------------------------
   * Sender handling
   * ----------------------------- */

  // ⚠️ Important: your schema does NOT store reporterId on incident
  // so we use the related reporter record
  const senderId =
    incident.reporter?.id ??
    "anonymous-reporter"; // fallback if anonymous

  const incidentName = incident.incidentIdDisplay;

  console.log("Session:", session);
  console.log("Incident:", incident);
  console.log("Attachments:", attachments);

  console.log("Incident reporter:", incident.reporter)

  return (
    <main className="min-h-screen w-full">
      <section className="min-h-screen bg-white dark:bg-black px-6">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-24 py-20">
          
          <IncidentOverview incident={incident} />

          <IncidentChat
            incidentId={incident.id}
            incidentName={incidentName}
            initialMessages={initialMessages}
            senderId={senderId}
          />

          <IncidentEvidence attachments={attachments} />

        </div>
      </section>
    </main>
  );
}