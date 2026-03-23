import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

// shadcn UI
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { HandlerIncidentsTable } from "@/components/handler-incidents-table";

export async function getHandler(handlerId: string) {
    const handler = await prisma.user.findUnique({
        where: { id: handlerId },
    });
    return handler;
}

export default async function HandlerIncidentsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.type !== "handler") redirect("/handler");

    console.log("Handler session details:", session);

    const handler = await getHandler(session.user.id);

    const handlerIncidents = await prisma.incident.findMany({
        where: {
            handlers: {
                some: {
                    handlerId: session.user.id,
                },
            },
        },
    });

    return (
        <div className="flex min-h-screen bg-white dark:bg-black p-10">
            <main className="w-full max-w-6xl mx-auto flex flex-col gap-16">

                <p className="text-md font-bold">Welcome, {handler?.name}!</p>

                {/* Header */}
                <section className="flex flex-col gap-4">
                    <p className="text-4xl font-extrabold text-black dark:text-white">
                        Assigned incidents
                    </p>

                    <p className="text-gray-500 text-sm max-w-2xl">
                        Overview of all incidents currently assigned to you.
                        Click on a record to review case details, update status,
                        and manage investigative actions.
                    </p>
                </section>

                {/* Table Section */}
                <section className="flex flex-col gap-6">

                    {handlerIncidents.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center space-y-2">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    No incidents are currently assigned to your account.
                                </p>
                                <p className="text-xs text-gray-500">
                                    New assignments will appear here automatically once allocated.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <HandlerIncidentsTable incidents={handlerIncidents} />

                            <p className="text-xs text-gray-500">
                                Records reflect current case ownership and operational status.
                                Ensure updates are logged to maintain audit integrity.
                            </p>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}