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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/generated/prisma/client";
import { IncidentStatus } from '@/lib/generated/prisma/enums';
import { Calendar } from "@/components/ui/calendar"

export function UpdateDeadlineDialogue({
    deadlineAt,
}: {
    deadlineAt: Date;
}) {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Date>(deadlineAt);
    const [date, setDate] = React.useState<Date | undefined>(new Date())

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
                    <DialogTitle>Update deadline</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Select a deadline date to assign to this incident.
                </DialogDescription>
                <div className="flex flex-col items-center justify-center">
                    <Calendar
                        mode="single"
                        selected={new Date(selected)}
                        onSelect={setDate}
                        className="rounded-lg border"
                    />
                </div>
                {/* Footer */}
                <div className="shrink-0 border-t p-4 bg-background">
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button
                            disabled={!date}
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