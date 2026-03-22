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
import type { User } from "@/lib/generated/prisma/client";
import { useState } from "react";

export function HandlersTable({ handlers }: { handlers: User[] }) {
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
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {handlers.map((handler, index) => (
          <TableRow
            key={handler.id}
            className="cursor-pointer hover:bg-muted"
            onClick={() => router.push(`/dashboard/team/${handler.id}`)}
            // onClick={() => handleOpen(incident.id)}
          >
            <TableCell className="font-medium">
              {index}
            </TableCell>

            <TableCell>{handler.name}</TableCell>

            <TableCell>{handler.email}</TableCell>

            <TableCell>{handler.status}</TableCell>

            <TableCell>{handler.role}</TableCell>
            
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