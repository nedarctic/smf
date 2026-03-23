"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  updateIncidentDeadline,
  updateIncidentStatus,
  closeIncident,
} from "@/actions/incident.actions";

enum IncidentStatus {
  New = "New",
  InReview = "InReview",
  Investigation = "Investigation",
  Resolved = "Resolved",
  Closed = "Closed",
}

export function IncidentHandlerCard({
  incident,
}: {
  incident: {
    id: string;
    companyId: string;
    incidentIdDisplay: string;
    category: string;
    description: string;
    location: string;
    involvedPeople: string | null;
    incidentDate: Date;
    status: "New" | "InReview" | "Investigation" | "Resolved" | "Closed";
    reporterType: "Anonymous" | "Confidential";
    secretCodeHash: string;
    deadlineAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
    duration: string | null;
  }
}) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState<string | null>(null);

  const [status, setStatus] = useState<"New" | "InReview" | "Investigation" | "Resolved" | "Closed">(
    incident.status
  );

  const [date, setDate] = useState<string>("");

  const isOverdue =
    incident.deadlineAt &&
    incident.status !== "Closed" &&
    new Date(incident.deadlineAt).getTime() < Date.now();

  function handleAction(action: string) {
    startTransition(async () => {
      try {
        if (action === "close") {
          await closeIncident(incident);
        } else if (action === "resolve") {
          await updateIncidentStatus(
            incident,
            "Resolved"
          );
        } else if (action === "changeStatus") {
          await updateIncidentStatus(incident, status);
        } else if (action === "deadline") {
          if (!date) return;
          await updateIncidentDeadline(
            incident,
            new Date(date)
          );
        }

        router.refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setConfirm(null);
      }
    });
  }

  return (
    <div className="border border-black dark:border-white p-8 flex flex-col gap-8 rounded-xl">

      {/* Top Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-extrabold text-black dark:text-white">
          {incident.incidentIdDisplay}
        </h2>

        <p className="text-sm text-gray-500">
          {incident.category} · {incident.location}
        </p>

        <p
          className={`text-sm font-semibold ${incident.status === IncidentStatus.Closed
            ? "text-green-600"
            : isOverdue
              ? "text-red-600"
              : "text-yellow-600"
            }`}
        >
          {isOverdue ? "Overdue" : incident.status}
        </p>
      </div>

      {/* Description */}
      <div className="text-sm text-black dark:text-white leading-relaxed">
        {incident.description}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 flex flex-col gap-1">
        <span>
          Created:{" "}
          {new Intl.DateTimeFormat("en-GB").format(
            new Date(incident.createdAt)
          )}
        </span>

        {incident.deadlineAt && (
          <span>
            Deadline:{" "}
            {new Intl.DateTimeFormat("en-GB").format(
              new Date(incident.deadlineAt)
            )}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-black dark:border-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

          <button
            onClick={() => setConfirm("close")}
            className="px-4 py-2 border text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Close incident
          </button>

          <button
            onClick={() => setConfirm("resolve")}
            className="px-4 py-2 border text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Mark as resolved
          </button>

          <button
            onClick={() => setConfirm("deadline")}
            className="px-4 py-2 border text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Set deadline
          </button>

          <button
            onClick={() => setConfirm("changeStatus")}
            className="px-4 py-2 border text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Change status
          </button>

        </div>
      </div>

      {/* Generic Confirmation Modal */}
      {confirm && confirm !== "changeStatus" && confirm !== "deadline" && (
        <div
          onClick={() => setConfirm(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black border p-6 max-w-md w-full rounded-lg"
          >
            <h3 className="text-lg font-bold mb-4">
              Confirm action
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              This will update the incident. Continue?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 border text-sm rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleAction(confirm)}
                disabled={isPending}
                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
              >
                {isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {confirm === "changeStatus" && (
        <div
          onClick={() => setConfirm(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black border p-6 max-w-md w-full rounded-lg"
          >
            <h3 className="text-lg font-bold mb-4">
              Change incident status
            </h3>

            <div className="flex flex-col gap-3 mb-6">
              {Object.values(IncidentStatus).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-md px-4 py-3 w-full border ${status === s
                    ? "bg-white text-black border-2 border-black"
                    : "bg-black text-white"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 border text-sm rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleAction("changeStatus")}
                disabled={isPending}
                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
              >
                {isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deadline Modal */}
      {confirm === "deadline" && (
        <div
          onClick={() => setConfirm(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black border p-6 max-w-md w-full rounded-lg"
          >
            <h3 className="text-lg font-bold mb-4">
              Set deadline
            </h3>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 rounded-xl px-4 py-3 mb-6 bg-transparent"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 border text-sm rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleAction("deadline")}
                disabled={isPending || !date}
                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
              >
                {isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}