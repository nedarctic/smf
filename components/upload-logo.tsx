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

import { useRouter } from "next/navigation";

export default function UploadLogoForm({ companyId }: { companyId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [pending, startTransition] = useTransition();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const MAX_SIZE = 10 * 1024 * 1024;
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {

            if (!file) return;

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("companyId", companyId);

                const res = await fetch("/api/logos/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(result.error || "Upload failed");
                }

                router.refresh();
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
                    <CardTitle>Upload Company Logo</CardTitle>
                    <CardDescription>
                        Select a logo and upload it for use in reporting page
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <form className="flex flex-col gap-3" onSubmit={handleUpload}>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const selected = e.target.files?.[0] || null;

                                if (selected && selected.size > MAX_SIZE) {
                                    setIsSuccess(false);
                                    setDialogMessage("File exceeds 10MB limit");
                                    setDialogOpen(true);

                                    // reset input
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }

                                    setFile(null);
                                    return;
                                }

                                setFile(selected);
                            }}
                            className="flex flex-col items-center justify-center"
                        />

                        <Button disabled={!file || pending} className="w-full">
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