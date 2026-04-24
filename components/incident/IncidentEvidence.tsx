import Link from "next/link";

type Attachment = {
  id: string;
  incidentId: string;
  uploadedBy: "Reporter" | "Handler" | string;
  fileName: string;
  filePath: string;
  createdAt: Date;
};

export default function IncidentEvidence({
  attachments,
}: {
  attachments: Attachment[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-4 max-w-2xl">
        <h2 className="text-2xl font-light">
          Evidence and documents
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Supporting files submitted in relation to this incident.
        </p>
      </header>

      {attachments.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No evidence has been submitted yet.
          <br />
          You can upload documents, images, or files to support your report.
        </p>
      ) : (
        <ul className="flex flex-col gap-6 max-w-3xl">
          {attachments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No evidence has been submitted yet.
              <br />
              You can upload documents, images, or files to support your report.
            </p>
          ) : (
            <div className="max-w-3xl max-h-80 overflow-y-auto pr-2">
              <ul className="flex flex-col gap-6">
                {attachments.map((attachment) => (
                  <li key={attachment.id} className="border-b pb-4">
                    <Link
                      href={`/api/files?url=${encodeURIComponent(attachment.filePath)}`}
                      target="_blank"
                      className="text-sm font-medium hover:underline"
                    >
                      {attachment.fileName}
                    </Link>

                    <div className="text-gray-500 text-xs">
                      Uploaded by {attachment.uploadedBy} ·{" "}
                      {new Date(attachment.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ul>
      )}
    </section>
  );
}