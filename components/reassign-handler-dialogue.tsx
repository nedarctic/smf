"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/generated/prisma/client";

export function ReassignHandlerDialog({
  handlers,
  currentHandlers,
}: {
  handlers: User[];
  currentHandlers: User[];
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  // ✅ Preselect current handlers when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelected(currentHandlers.map((h) => h.id));
    }
  }, [open, currentHandlers]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Assign / Reassign Handler
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col max-h-[80vh] p-0 overflow-hidden">

        {/* Header */}
        <DialogHeader className="p-6 shrink-0 border-b">
          <DialogTitle>Reassign Handler</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          Select one or more handlers for this incident.
        </DialogDescription>

        {/* Scrollable middle */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {handlers.map((handler) => (
            <div key={handler.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={handler.id}
                checked={selected.includes(handler.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected((prev) => [...prev, handler.id]);
                  } else {
                    setSelected((prev) =>
                      prev.filter((id) => id !== handler.id)
                    );
                  }
                }}
              />
              <Label htmlFor={handler.id} className="cursor-pointer">
                {handler.name}
              </Label>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t p-4 bg-background">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              disabled={selected.length === 0}
              onClick={() => {
                // ✅ selected = array of handler IDs
                console.log("Selected handlers:", selected);

                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}