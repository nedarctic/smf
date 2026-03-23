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
import { uploadAdditionalEvidence } from "@/actions/attachment.actions";
import { getSession } from "next-auth/react";

export default function UploadEvidenceForm({ incidentId }: { incidentId: string }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleUpload = (e: React.SubmitEvent<HTMLFormElement>) => {

    e.preventDefault();

    startTransition(async () => {

      const session = await getSession();

      const uploaderType = session?.user.type === "incident" ? "Reporter" : "Handler";

      if (!files) return;

      try {

        await uploadAdditionalEvidence({
          files,
          incidentId,
          uploaderType
        }).then(() => {

          console.log("Additional evidence successfully uploaded")
          setFiles(null);

        });        

      } catch (err) {
        console.error(err);
        alert("Upload failed");
      } 
    })
  };

  return (
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

        <Button
          disabled={!files || loading}
          className="w-full"
        >
          {pending ? "Uploading..." : "Upload"}
        </Button>
        </form>
      </CardContent>
    </Card>
  );
}