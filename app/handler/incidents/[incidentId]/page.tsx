import { IncidentHandlerCard } from "@/components/incident/IncidentHandlerCard";
import IncidentChat from "@/components/incident/IncidentChat";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getInitialMessages } from "@/app/report/[reportingLink]/track/incident/page";
import { ArrowLeft } from "lucide-react";
import { getIncident } from "@/app/report/[reportingLink]/track/incident/page";
import IncidentEvidence from "@/components/incident/IncidentEvidence";
import { getAttachments } from "@/app/report/[reportingLink]/track/incident/page";
import UploadEvidenceForm from "@/components/incident/upload-evidence-form";

export default async function IncidentPage({
    params,
}: {
    params: Promise<{ incidentId: string }>;
}) {
    const { incidentId } = await params;

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const incident = await getIncident(incidentId);
    if (!incident) return notFound();

    const attachments = await getAttachments(incidentId);
    const initialMessages = await getInitialMessages(incidentId);

    return (
        <main className="min-h-screen w-full bg-white dark:bg-black">
            <section className="px-4 md:px-6 py-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">

                    {/* TOP BAR (Compact Overview) */}
                    <div className="border rounded-2xl p-6 dark:border-zinc-800">
                        <IncidentHandlerCard incident={incident} />
                    </div>

                    {/* MAIN WORKSPACE */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">

                        {/* CHAT (PRIMARY AREA) */}
                        <div className="w-full">
                            <IncidentChat
                                incidentId={incident.id}
                                incidentName={incident.incidentIdDisplay}
                                initialMessages={initialMessages}
                                senderId={userId}
                                senderType="Handler"
                            />
                        </div>

                        {/* SIDEBAR */}
                        <aside className="flex flex-col gap-6 sticky top-6">

                            {/* Evidence */}
                            <div className="border rounded-2xl p-5 dark:border-zinc-800">
                                <IncidentEvidence attachments={attachments} />
                            </div>

                            {/* Upload */}
                            <div className="border rounded-2xl p-5 dark:border-zinc-800">
                                <UploadEvidenceForm incidentId={incidentId} />
                            </div>

                        </aside>
                    </div>

                </div>
            </section>
        </main>
    );
}