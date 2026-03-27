"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";import type { Incident } from "@/lib/generated/prisma/client";
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
    <Table className="w-full table-fixed">
  <TableHeader>
    <TableRow>
      <TableHead className="w-2/12">ID</TableHead>
      <TableHead className="w-3/12">Category</TableHead>
      <TableHead className="w-3/12">Location</TableHead>
      <TableHead className="w-2/12">Status</TableHead>
      <TableHead className="w-2/12 text-right">Date</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {incidents.map((incident) => (
      <TableRow
        key={incident.id}
        className="cursor-pointer hover:bg-muted"
        onClick={() => router.push(`/dashboard/incidents/${incident.id}`)}
      >
        <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap">
          {incident.incidentIdDisplay}
        </TableCell>

        <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap">
          {incident.category}
        </TableCell>

        <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-50">
          {incident.location}
        </TableCell>

        <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap">
          {incident.status}
        </TableCell>

        <TableCell className="text-right overflow-hidden text-ellipsis whitespace-nowrap">
          {new Date(incident.incidentDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          })}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

    {/* <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Incident Details</SheetTitle>
          </SheetHeader>

          {selectedId && (
            <IncidentDetails incidentId={selectedId} />
          )}
        </SheetContent>
      </Sheet> */}
      </>
  );
}