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
import { User } from "@/lib/generated/prisma/client";
import { UserRole } from "@/lib/generated/prisma/enums";
import { resendInvite } from "@/actions/team.actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReinviteHandler ({ user }: { user: User }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<UserRole>(user.role);

  const handleReinviteMember = () => {
    startTransition(async () => {
      try {
        await resendInvite(user.id);
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
        <Button variant="outline">Reinvite Member</Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col max-h-[80vh] p-0 overflow-hidden">

        <DialogHeader className="p-6 border-b">
          <DialogTitle>Reinvite Member?</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          Are you sure you want to send a reinvitation to {user.name}?
        </DialogDescription>

        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleReinviteMember} disabled={pending}>
            {pending ? "Reinviting..." : "Reinvite"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}