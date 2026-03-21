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
import { Calendar } from "@/components/ui/calendar"
import { Incident } from "@/lib/generated/prisma/client";

export function CloseIncidentDialogue({
    incident,
}: {
    incident: Incident;
}) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Incident>(incident);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Update deadline
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col max-h-[90vh] p-0 overflow-hidden">

                {/* Header */}
                <DialogHeader className="p-6 shrink-0 border-b">
                    <DialogTitle>Delete incident</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Delete an incident.
                </DialogDescription>
                
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <p>Delete the selected incident?</p>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t p-4 bg-background">
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button
                            disabled={!selected}
                            onClick={() => {
                                // handle confirm logic here
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