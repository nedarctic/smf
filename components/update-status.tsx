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
import {IncidentStatus} from '@/lib/generated/prisma/enums'
import { updateIncidentStatus } from "@/actions/incident.actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Incident } from "@/lib/generated/prisma/client";

export function UpdateStatusDialogue({
    activeStatus,
    incident
}: {
    activeStatus: IncidentStatus;
    incident: Incident
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<IncidentStatus>(activeStatus);

    const handleUpdateStatus = () => {
        startTransition(async () => {
            try {
                updateIncidentStatus(incident, selected);
                setOpen(false);
                router.refresh();
            } catch (error){
                console.log(error)
            }
        });
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Update Status
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col max-h-[80vh] p-0 overflow-hidden">

                {/* Header */}
                <DialogHeader className="p-6 shrink-0 border-b">
                    <DialogTitle>Update status</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Select a status to assign to this incident.
                </DialogDescription>

                {/* Scrollable middle */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <RadioGroup
                        value={selected}
                        onValueChange={(value) => setSelected(value as IncidentStatus)}
                        className="space-y-3"
                    >
                        {Object.values(IncidentStatus).map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                                <RadioGroupItem value={status} id={status} />
                                <Label htmlFor={status} className="cursor-pointer">
                                    {status}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t p-4 bg-background">
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button
                            disabled={!selected}
                            onClick={handleUpdateStatus}
                        >
                            {pending ? "Updating..." : "Confirm"}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}