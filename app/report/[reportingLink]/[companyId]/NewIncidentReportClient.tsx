"use client";

import React from "react";
import { CreateIncident } from "@/actions/report.actions";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";

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
import { useRouter } from "next/navigation";
import Image from 'next/image';

type CreateIncidentState =
  | { success: false; error?: string }
  | { success: true; incidentNumber: string; secretCode: string };

const initialState: CreateIncidentState = { success: false };

export function NewIncidentReportClient({
  categories,
  reportingLink,
  slaDays,
  logoUrl,
  reportingPageDetails,
}: {
  categories: {
    id: string;
    companyId: string;
    categoryName: string;
    createdAt: Date;
  }[],
  reportingLink: string;
  slaDays: string | null;
  logoUrl: string | null;
  reportingPageDetails: {
    id: string;
    companyId: string;
    title: string | null;
    introContent: string | null;
    policyUrl: string | null;
    reportingPageUrl: string | null;
  } | null
}) {

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const [state, setState] = useState<CreateIncidentState>(initialState);

  console.log("reporting link at the incident reporting page",
    reportingLink
  )

  const [reporterType, setReporterType] = useState<
    "Anonymous" | "Confidential" | null
  >(null);

  const [open, setOpen] = useState(false);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [involvedPeople, setInvolvedPeople] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [duration, setDuration] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (state.success) setOpen(true);
  }, [state.success]);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const companyId = categories.map(ct => ct.companyId)

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await CreateIncident({
        reporterType: reporterType ?? "",
        category,
        description,
        location,
        involvedPeople,
        incidentDate,
        duration,
        files,
        name,
        email,
        phone,
        companyId: companyId[0],
        slaDays,
      });

      setState(result);
    });
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        className="min-h-screen w-full bg-white dark:bg-black px-6 py-24"
      >

        <div className="max-w-3xl mx-auto space-y-16">

          {/* Header */}
          <header className="space-y-6 text-center">
            {logoUrl && (
              <div className="flex justify-center">
                <Image
                  src={logoUrl}
                  width={100}
                  height={100}
                  priority
                  unoptimized
                  alt="Company logo"
                  className="h-12 md:h-16 object-contain"
                />
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-light">
                {reportingPageDetails?.title ?? "Report an Incident"}
              </h1>
              <p className="text-muted-foreground">
                {reportingPageDetails?.introContent ?? "Use this form to report misconduct, abuse, corruption, or other unethical behavior."}
              </p>
            </div>
          </header>

          {/* Reporter Type */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">
              Would you like to report anonymously?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                onClick={() => setReporterType("Anonymous")}
                className={`cursor-pointer border-2 ${reporterType === "Anonymous" ? "border-primary" : ""
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
                className={`cursor-pointer border-2 ${reporterType === "Confidential" ? "border-primary" : ""
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
            <Select onValueChange={setCategory} required>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
              placeholder="Describe the incident in detail"
            />

            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Where did the incident happen?"
            />

            <Input
              value={involvedPeople}
              onChange={(e) => setInvolvedPeople(e.target.value)}
              placeholder="Who was involved?"
            />

            <div className="space-y-2">
              <label className="text-sm">
                When did this incident occur?
              </label>
              <Input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
              />
            </div>

            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="How long has this occurred?"
            />

            <Input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </section>

          {/* Confidential Reporter */}
          {reporterType === "Confidential" && (
            <section className="space-y-6">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
              />
            </section>
          )}

          <Button
            type="submit"
            disabled={!reporterType || pending}
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