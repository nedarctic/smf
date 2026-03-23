"use client";

import { useRouter } from "next/navigation"
import { Incident } from "@/lib/generated/prisma/client";

import {
    Card,
    CardContent,
} from "./ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "./ui/table";

export function HandlerIncidentsTable({ incidents }: {
    incidents: Incident[]
}) {

    const router = useRouter();

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Incident ID</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {incidents.map((incident) => (
                            <TableRow onClick={() => router.push(`/handler/incidents/${incident.id}`)} key={incident.id}>

                                <TableCell className="font-medium">
                                    {incident.incidentIdDisplay}
                                </TableCell>

                                <TableCell>
                                    {incident.category}
                                </TableCell>

                                <TableCell
                                    className={`font-semibold ${incident.status === "Closed"
                                        ? "text-green-600"
                                        : incident.status === "Resolved"
                                            ? "text-blue-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {incident.status}
                                </TableCell>

                                <TableCell>
                                    {incident.deadlineAt
                                        ? new Intl.DateTimeFormat("en-GB", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                        }).format(new Date(incident.deadlineAt))
                                        : "—"}
                                </TableCell>

                                <TableCell>
                                    {new Intl.DateTimeFormat("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    }).format(new Date(incident.createdAt))}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}