import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

import IncidentChat from "@/components/incident/IncidentChat";
import IncidentEvidence from "@/components/incident/IncidentEvidence";
import IncidentOverview from "@/components/incident/IncidentOverview";
import UploadEvidenceForm from "@/components/incident/upload-evidence-form";

export async function getIncident(incidentId: string) {
  return prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      reporter: true,
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
  return initialMessages;
}

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

  const senderId =
    incident.reporter?.id ??
    "anonymous-reporter";

  const incidentName = incident.incidentIdDisplay;

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black">
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* TOP BAR (Compact Overview) */}
          <div className="border rounded-2xl p-6 dark:border-zinc-800">
            <IncidentOverview incident={incident} />
          </div>

          {/* MAIN WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">

            {/* CHAT (PRIMARY AREA) */}
            <div className="w-full">
              <IncidentChat
                incidentId={incident.id}
                incidentName={incidentName}
                initialMessages={initialMessages}
                senderId={senderId}
                senderType="Reporter"
              />
            </div>

            {/* SIDEBAR */}
            <aside className="flex flex-col gap-6 sticky top-6">

              {/* Evidence */}
              <div className="border rounded-2xl p-5 dark:border-zinc-800">
                <IncidentEvidence attachments={attachments} />
              </div>

              {/* Upload */}
              <div>
                <UploadEvidenceForm incidentId={incident.id} />
              </div>

            </aside>
          </div>

        </div>
      </section>
    </main>
  );
}