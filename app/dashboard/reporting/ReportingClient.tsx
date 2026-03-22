"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTransition, useState } from "react";
import { updateReportingPage } from "@/actions/reporting.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ReportingClient({
  data,
}: {
  data:
  | {
    slug: string;
    page: {
      title: string | null;
      policyUrl: string | null;
      id: string;
      companyId: string;
      introContent: string | null;
      reportingPageUrl: string | null;
    } | null;
    error?: undefined;
  }
  | {
    error: string;
    slug?: undefined;
    page?: undefined;
  };
}) {
  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");

  // Handle error case early
  if ("error" in data) {
    return <div className="p-6 text-red-500">{data.error}</div>;
  }

  const initialSlug = data.slug || "";
  const initialTitle = data.page?.title || "Report an Incident";
  const initialIntro = data.page?.introContent || "";
  const initialPolicyUrl = data.page?.policyUrl || "";

  const [slug, setSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [intro, setIntro] = useState(initialIntro);
  const [policyUrl, setPolicyUrl] = useState(initialPolicyUrl);

  const fullLink = `${process.env.NEXT_PUBLIC_APP_URL}/report/${slug}`;

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await updateReportingPage({
          slug,
          title,
          intro,
          policyUrl,
        });

        if (res?.error) {
          console.error(res.error);
          return;
        }

        setSuccess("Reporting page updated successfully.");
        setOpen(true);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullLink);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">

      {/* Success Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>{success}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reporting Link */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Link</CardTitle>
          <CardDescription>
            Share this link with employees to report incidents
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="company-slug"
          />

          <div className="flex gap-2">
            <Input value={fullLink} readOnly />
            <Button onClick={copyLink}>Copy</Button>
          </div>

        </CardContent>
      </Card>

      {/* Page Content */}
      {/* Page Content */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Page Content</CardTitle>
          <CardDescription>
            Customize what reporters see before submitting
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label>Page title</label>
            <Input
              placeholder="Page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Intro / instructions</label>
            <Textarea
              placeholder="Intro / instructions"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Policy URL (optional)</label>
            <Input
              placeholder="Policy URL (optional)"
              value={policyUrl}
              onChange={(e) => setPolicyUrl(e.target.value)}
            />
          </div>

        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>

    </div>
  );
}