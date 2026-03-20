"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IncidentDetails } from "./incident-details";

export function IncidentDetailsSheet() {
  const [open, setOpen] = useState(false);
  const [incidentId, setIncidentId] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setIncidentId(id);
    setOpen(true);
  };

  return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-125 sm:w-150 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Incident Details</SheetTitle>
          </SheetHeader>

          {incidentId && (
            <IncidentDetails incidentId={incidentId} />
          )}
        </SheetContent>
      </Sheet>
  );
}