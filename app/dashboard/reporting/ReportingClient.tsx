"use client";

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
import { createCategory, updateReportingPage } from "@/actions/reporting.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import UploadLogoForm from "@/components/upload-logo";

export default function ReportingClient({ data }: any) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if ("error" in data) {
    return <div className="p-6 text-red-500">{data.error}</div>;
  }

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState(data.categories || []);

  const [slug, setSlug] = useState(data.slug || "");
  const [title, setTitle] = useState(data.page?.title || "Report an Incident");
  const [intro, setIntro] = useState(data.page?.introContent || "");
  const [policyUrl, setPolicyUrl] = useState(data.page?.policyUrl || "");

  const fullLink = `${process.env.NEXT_PUBLIC_APP_URL}/report/${slug}`;

  const handleSave = () => {
    startTransition(async () => {
      try {
        setError("");

        const res = await updateReportingPage({
          slug,
          title,
          intro,
          policyUrl,
        });

        if (res?.error) {
          setError(res.error);
          setSuccess("");
          setOpen(true);
          return;
        }

        setSuccess("Reporting page updated successfully.");
        setOpen(true);
      } catch (err) {
        setError("Something went wrong.");
        setOpen(true);
        console.error(err);
      }
    });
  };

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;

    startTransition(async () => {
      try {
        const res = await createCategory({ name: categoryName });

        if (res?.error) {
          setError(res.error);
          setSuccess("");
          setOpen(true);
          return;
        };

        // setCategories((prev: any) => [
        //   { id: crypto.randomUUID(), categoryName },
        //   ...prev,
        // ]);

        setCategoryName("");
      } catch (err) {
        console.error(err);
      }
    });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullLink);

    toast.success("Copied successfully")

  };

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full rounded-2xl">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-black/80 border-b dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Reporting Page Settings
            </h1>
            <p className="text-xs text-gray-500">
              Configure your reporting experience
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={pending}
            className="min-w-35"
          >
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{error ? "Error" : "Success"}</DialogTitle>
            <DialogDescription>
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                success
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* LEFT */}
          <div className="flex flex-col gap-8">

            {/* Reporting Link */}
            <Card>
              <CardHeader>
                <CardTitle>Reporting Link</CardTitle>
                <CardDescription>
                  Share this link with employees
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />

                <div className="flex gap-2">
                  <Input value={fullLink} readOnly />
                  <Button onClick={copyLink}>Copy</Button>
                </div>
              </CardContent>
            </Card>

            {/* Page Content */}
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>
                  Customize what users see
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-gray-500">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Intro</label>
                  <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Policy URL</label>
                  <Input value={policyUrl} onChange={(e) => setPolicyUrl(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Manage reporting categories
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="New category"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className="border rounded-lg px-3 py-2 text-sm text-center dark:border-zinc-800"
                    >
                      {cat.categoryName}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="flex flex-col gap-6 sticky top-24">
            <UploadLogoForm companyId={data.page?.companyId} />
          </aside>

        </div>
      </div>
    </div>
  );
}
