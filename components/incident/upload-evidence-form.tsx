"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { uploadAdditionalEvidence } from "@/actions/attachment.actions";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UploadEvidenceForm({ incidentId }: { incidentId: string }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [pending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const session = await getSession();

      const uploaderType =
        session?.user.type === "incident" ? "Reporter" : "Handler";

      if (!files) return;

      try {
        await uploadAdditionalEvidence({
          files,
          incidentId,
          uploaderType,
        });

        setFiles(null);
        setIsSuccess(true);
        setDialogMessage("Upload successful");
        router.refresh();
        setDialogOpen(true);
      } catch (err) {
        console.error(err);
        setIsSuccess(false);
        setDialogMessage("Upload failed");
        setDialogOpen(true);
      }
    });
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      // Refresh route after dialog closes
      router.refresh();
    }
  };

  return (
    <>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Upload More Evidence</CardTitle>
          <CardDescription>
            Select a file and upload it securely
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-3" onSubmit={handleUpload}>
            <Input
              type="file"
              onChange={(e) => setFiles(e.target.files)}
            />

            <Button disabled={!files || pending} className="w-full">
              {pending ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isSuccess ? "Success" : "Error"}
            </DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}