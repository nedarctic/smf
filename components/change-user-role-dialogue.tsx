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
import { UserRole } from "@/lib/generated/prisma/enums";
import { updateUserRole } from "@/actions/team.actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function ChangeUserRoleDialog({ user }: { user: User }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<UserRole>(user.role);

  const handleUpdateRole = () => {
    startTransition(async () => {
      try {
        await updateUserRole(user.id, selected);
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
        <Button variant="outline">Change Role</Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col max-h-[80vh] p-0 overflow-hidden">

        <DialogHeader className="p-6 border-b">
          <DialogTitle>Change User Role</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          Select a role for this user.
        </DialogDescription>

        <div className="px-6 py-4">
          <RadioGroup
            value={selected}
            onValueChange={(value) => setSelected(value as UserRole)}
            className="space-y-3"
          >
            {Object.values(UserRole).map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <RadioGroupItem value={role} id={role} />
                <Label htmlFor={role}>{role}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleUpdateRole} disabled={pending}>
            {pending ? "Updating..." : "Confirm"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}