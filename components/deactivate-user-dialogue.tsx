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
import { deactivateUser } from "@/actions/team.actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeactivateUserDialog({ userId }: { userId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);

  const handleDeactivate = () => {
    startTransition(async () => {
      try {
        await deactivateUser(userId);
        setOpen(false);
        
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Deactivate User</Button>
      </DialogTrigger>

      <DialogContent className="p-6 space-y-4">

        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you sure you want to deactivate this user?
        </DialogDescription>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={pending}
          >
            {pending ? "Removing..." : "Confirm"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}