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
import { Calendar } from "./ui/calendar";
import { updateIncidentDeadline } from "@/actions/incident.actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Incident } from "@/lib/generated/prisma/client";

export function UpdateDeadlineDialogue({
    deadlineAt,
    incident,
}: {
    deadlineAt: Date;
    incident: Incident;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(deadlineAt);

    const handleUpdateDeadline = () => {
        if (!selectedDate) return;

        startTransition(async () => {
            try {
                await updateIncidentDeadline(incident, selectedDate);

                setOpen(false);
                router.refresh();
            } catch (error) {
                console.log(error);
            }
        });
    };

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
                        selected={selectedDate}
                        onSelect={setSelectedDate}
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
                            disabled={!selectedDate || pending}
                            onClick={handleUpdateDeadline}
                        >
                            {pending ? "Updating..." : "Confirm"}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}