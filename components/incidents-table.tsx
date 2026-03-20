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
import { Sheet, 
  SheetContent, 
  SheetTitle,
  SheetHeader
} from "./ui/sheet";
import type { Incident } from "@/lib/generated/prisma/client";
import { IncidentDetails } from "./incident-details";
import { useState } from "react";

export function IncidentsTable({ incidents }: { incidents: Incident[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <>
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
            // onClick={() => router.push(`/dashboard/incidents/${incident.id}`)}
            onClick={() => handleOpen(incident.id)}
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

    <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Incident Details</SheetTitle>
          </SheetHeader>

          {selectedId && (
            <IncidentDetails incidentId={selectedId} />
          )}
        </SheetContent>
      </Sheet>
      </>
  );
}