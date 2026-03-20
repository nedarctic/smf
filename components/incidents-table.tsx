"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Incident } from "@/lib/generated/prisma/client";

export function IncidentsTable({ incidents }: { incidents: Incident[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {incidents.map((incident) => (
          <TableRow
            key={incident.id}
            className="cursor-pointer hover:bg-muted"
            onClick={() => router.push(`/dashboard/incidents/${incident.id}`)}
          >
            <TableCell className="font-medium">
              {incident.incidentIdDisplay}
            </TableCell>

            <TableCell>{incident.category}</TableCell>

            <TableCell>{incident.location}</TableCell>

            <TableCell>{incident.status}</TableCell>

            <TableCell className="text-right">
              {new Date(incident.incidentDate)
                .toLocaleDateString("en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "UTC"
                  })
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}