"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/generated/prisma/client";

export function ReassignHandlerDialog({
  handlers,
}: {
  handlers: User[];
}) {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <Dialog>
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

  {/* Scrollable middle */}
  <div className="flex-1 overflow-y-auto px-6 py-4">
    <RadioGroup
      value={selected || ""}
      onValueChange={setSelected}
      className="space-y-3"
    >
      {handlers.map((handler) => (
        <div key={handler.id} className="flex items-center space-x-2">
          <RadioGroupItem value={handler.id} id={handler.id} />
          <Label htmlFor={handler.id} className="cursor-pointer">
            {handler.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>

  {/* Footer */}
  <div className="shrink-0 border-t p-4 bg-background">
    <div className="flex justify-end gap-2 w-full">
      <Button variant="outline">Cancel</Button>
      <Button disabled={!selected}>Confirm</Button>
    </div>
  </div>

</DialogContent>
    </Dialog>
  );
}