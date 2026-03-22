"use client";

import { useActionState } from "react";
import { CreateIncident } from "@/actions/report.actions";
import { useState, useEffect } from "react";
import Link from "next/link";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type CreateIncidentState =
  | { success: false; error?: string }
  | { success: true; incidentNumber: string; secretCode: string };

const initialState: CreateIncidentState = { success: false };

export function NewIncidentReportClient({
  categories,
  reportingLink
}: {
  categories: {
    id: string;
    companyId: string;
    categoryName: string;
    createdAt: Date;
  }[],
  reportingLink: string;
}) {

  const [state, formAction, pending] = useActionState(
    CreateIncident,
    initialState
  );

  console.log("reporting link at the incident reporting page",
    reportingLink
  )

  const [reporterType, setReporterType] = useState<
    "Anonymous" | "Confidential" | null
  >(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.success) setOpen(true);
  }, [state.success]);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <>
      <form
        action={formAction}
        className="min-h-screen w-full bg-white dark:bg-black px-6 py-24"
      >
        <input type="hidden" name="reporterType" value={reporterType ?? ""} />

        <div className="max-w-3xl mx-auto space-y-16">

          {/* Header */}
          <header className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-light">
              Report an Incident
            </h1>
            <p className="text-muted-foreground">
              Use this form to report misconduct, abuse, corruption, or other
              unethical behavior.
            </p>
          </header>

          {/* Reporter Type */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">
              Would you like to report anonymously?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                onClick={() => setReporterType("Anonymous")}
                className={`cursor-pointer border-2 ${
                  reporterType === "Anonymous" ? "border-primary" : ""
                }`}
              >
                <CardContent className="p-6 space-y-2">
                  <p className="font-semibold">Yes, report anonymously</p>
                  <p className="text-sm text-muted-foreground">
                    No name or contact details will be collected.
                  </p>
                </CardContent>
              </Card>

              <Card
                onClick={() => setReporterType("Confidential")}
                className={`cursor-pointer border-2 ${
                  reporterType === "Confidential" ? "border-primary" : ""
                }`}
              >
                <CardContent className="p-6 space-y-2">
                  <p className="font-semibold">
                    No, share my details confidentially
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your identity will only be visible to authorized handlers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Incident Details */}
          <section className="space-y-6">
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select incident category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              name="description"
              rows={6}
              required
              placeholder="Describe the incident in detail"
            />

            <Input name="location" required placeholder="Where did the incident happen?" />

            <Input name="involvedPeople" placeholder="Who was involved?" />

            <div className="space-y-2">
              <label className="text-sm">
                When did this incident occur?
              </label>
              <Input type="date" name="incidentDate" required />
            </div>

            <Input name="duration" placeholder="How long has this occurred?" />

            <Input type="file" name="files" multiple />
          </section>

          {/* Confidential Reporter */}
          {reporterType === "Confidential" && (
            <section className="space-y-6">
              <Input name="name" placeholder="Full name" />
              <Input name="email" type="email" placeholder="Email address" />
              <Input name="phone" placeholder="Phone number (optional)" />
            </section>
          )}

          <Button
            type="submit"
            disabled={!reporterType}
            className="w-full rounded-full py-6"
          >
            {pending ? "Submitting..." : "Submit report securely"}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {state.success && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="space-y-6">
            <DialogHeader>
              <DialogTitle>Incident submitted successfully</DialogTitle>
              <DialogDescription>
                Save your details below. You will need them to track your report.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="text-sm text-muted-foreground">Incident ID</p>
                  <p className="font-semibold">{state.incidentNumber}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(state.incidentNumber)}
                >
                  Copy
                </Button>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="text-sm text-red-500">Secret Code</p>
                  <p className="font-mono tracking-widest">
                    {state.secretCode}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(state.secretCode)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <Link href={`${reportingLink}/track`}>
              <Button className="w-full">
                Go to tracking page
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}