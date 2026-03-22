"use client";

import { useActionState } from "react";
import { CreateIncident } from "@/actions/report.actions";
import { useState } from "react";
import Link from "next/link";

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
    initialState);

  const [reporterType, setReporterType] = useState<
    "Anonymous" | "Confidential" | null
  >(null);

  return (
    <form
      action={formAction}
      className="min-h-screen w-full bg-white dark:bg-black px-6 py-24"
    >
      {/* reporterType is derived from UI state */}
      <input type="hidden" name="reporterType" value={reporterType ?? ""} />

      <div className="max-w-3xl mx-auto space-y-16">

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-black dark:text-white text-3xl md:text-5xl font-light">
            Report an Incident
          </h1>
          <p className="text-black/70 dark:text-white/70 text-base leading-relaxed">
            Use this form to report misconduct, abuse, corruption, or other
            unethical behavior.
          </p>
        </header>

        {/* Reporter Type */}
        <section className="space-y-6">
          <h2 className="text-black dark:text-white text-xl font-semibold">
            Would you like to report anonymously?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setReporterType("Anonymous")}
              className={`border-2 rounded-2xl p-6 text-left transition ${reporterType === "Anonymous"
                ? "border-black dark:border-white"
                : "border-black/30 dark:border-white/30"
                }`}
            >
              <p className="font-semibold">Yes, report anonymously</p>
              <p className="text-sm opacity-70">
                No name or contact details will be collected.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setReporterType("Confidential")}
              className={`border-2 rounded-2xl p-6 text-left transition ${reporterType === "Confidential"
                ? "border-black dark:border-white"
                : "border-black/30 dark:border-white/30"
                }`}
            >
              <p className="font-semibold">No, share my details confidentially</p>
              <p className="text-sm opacity-70">
                Your identity will only be visible to authorized handlers.
              </p>
            </button>
          </div>
        </section>

        {/* Incident Details */}
        <section className="space-y-8">
          <select
            name="category"
            required
            className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
          >
            <option className="text-black font-bold" value="">Select incident category</option>
            {categories.length ? categories.map(category => (<option key={category.id} className="text-black">{category.categoryName}</option>)) : ""}
          </select>

          <textarea
            name="description"
            rows={6}
            required
            placeholder="Describe the incident in detail"
            className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
          />

          <input
            name="location"
            required
            placeholder="Where did the incident happen?"
            className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
          />

          <input
            name="involvedPeople"
            placeholder="Who was involved?"
            className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
          />

          <label htmlFor="incidentDate" className="text-sm font-normal text-black dark:text-white mb-3">When did this incident occur?</label>

          <input
            type="date"
            name="incidentDate"
            id="incidentDate"
            required
            className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
          />

          <input
            name="duration"
            placeholder="How long has this occurred?"
            className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
          />

          <input
            type="file"
            name="files"
            multiple
            className="w-full text-sm text-black dark:text-white"
          />
        </section>

        {/* Confidential Reporter */}
        {reporterType === "Confidential" && (
          <section className="space-y-6">
            <input
              name="name"
              placeholder="Full name"
              className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
            />
            <input
              name="phone"
              placeholder="Phone number (optional)"
              className="w-full border-2 rounded-xl px-4 py-3 bg-transparent"
            />
          </section>
        )}

        <button
          type="submit"
          disabled={!reporterType}
          className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 font-semibold disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit report securely"}
        </button>

        {/* Confirmation */}
        {state.success && (
          <div className="border-2 border-black dark:border-white rounded-2xl p-6">
            <p className="text-lg font-semibold">
              Incident submitted successfully
            </p>

            <p className="mt-4">
              <strong>Incident ID:</strong> {state.incidentNumber}
            </p>

            <p className="mt-4 text-red-600 dark:text-red-400 font-semibold">
              Secret Code (save this now):
            </p>

            <p className="mt-1 text-xl tracking-widest">
              {state.secretCode}
            </p>

            <Link className="mt- 6bg-black dark:bg-white text-white dark:text-black font-sm flex flex-col items-center justify-center rounded-md p-4" href={`/report/${reportingLink}/track`}>Go to tracking page</Link>
          </div>
        )}
      </div>
    </form>
  );
}