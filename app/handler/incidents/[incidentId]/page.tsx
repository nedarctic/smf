import { IncidentHandlerCard } from "@/components/incident/IncidentHandlerCard";
import IncidentChat from "@/components/incident/IncidentChat";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getInitialMessages } from "@/app/report/[reportingLink]/track/incident/page";
import { ArrowLeft } from "lucide-react";
import { getIncident } from "@/app/report/[reportingLink]/track/incident/page";

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;

  const session = await getServerSession(authOptions);
  
  const userId = session?.user.id;

  const incident = await getIncident(incidentId)

  if (!incident) return notFound();

  const initialMessages = await getInitialMessages(incidentId);
  console.log("Initial messages at the handler specific incident page:", initialMessages);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-10 gap-10">

      {/* Back button */}
      <div className="flex flex-row gap-2 self-start ml-6 lg:ml-16 items-center">
        <ArrowLeft size={18} />
        <Link
          href="/handler/incidents"
          className="text-gray-500 font-medium text-sm hover:underline"
        >
          Back to incidents
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
        Incident Details & Chat
      </h1>

      {/* Incident Info */}
      <div className="w-full max-w-4xl">
        <IncidentHandlerCard incident={incident} />
      </div>

      {/* Chat */}
      <div className="w-full max-w-4xl">
        <IncidentChat
          incidentId={incident.id}
          incidentName={incident.incidentIdDisplay}
          initialMessages={initialMessages}
          senderId={userId}
          senderType={"Handler"}
        />
      </div>
    </div>
  );
}