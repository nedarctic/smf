"use client";

import { useRouter } from "next/navigation";

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
  TableCell,
} from "./ui/table";

type Incident = {
  id: string;
  incidentIdDisplay: string;
  category: string;
  status:
    | "New"
    | "InReview"
    | "Investigation"
    | "Resolved"
    | "Closed";
  companyId: string;
  description: string;
  location: string;
  involvedPeople: string | null;
  incidentDate: Date;
  reporterType: "Anonymous" | "Confidential";
  secretCodeHash: string;
  deadlineAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  duration: string | null;
};

export function HandlerIncidentsTable({
  incidents,
}: {
  incidents: Incident[];
}) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="w-full">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Incident ID</TableHead>
              <TableHead className="w-1/5">Category</TableHead>
              <TableHead className="w-1/5">Status</TableHead>
              <TableHead className="w-1/5">Deadline</TableHead>
              <TableHead className="w-1/5">Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {incidents.map((incident) => (
              <TableRow
                key={incident.id}
                onClick={() =>
                  router.push(
                    `/handler/incidents/${incident.id}`
                  )
                }
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {incident.incidentIdDisplay}
                </TableCell>

                <TableCell>
                  {incident.category}
                </TableCell>

                <TableCell
                  className={`font-semibold ${
                    incident.status === "Closed"
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
                      }).format(
                        new Date(incident.deadlineAt)
                      )
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