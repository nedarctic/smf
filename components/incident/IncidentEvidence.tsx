import Link from "next/link";

type Attachment = {
  id: string;
  incidentId: string;
  uploadedBy: "Reporter" | "Handler" | string;
  fileName: string;
  filePath: string; // now from Django
  createdAt: Date;
};

export default function IncidentEvidence({
  attachments,
}: {
  attachments: Attachment[];
}) {
  return (
    <section className="flex flex-col gap-12 border-t border-gray-200 dark:border-zinc-800 pt-16">
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
          No supporting documents submitted.
        </p>
      ) : (
        <ul className="flex flex-col gap-6 max-w-3xl">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="border-b pb-4"
            >
              <Link
                href={`${process.env.DJANGO_API_URL}${attachment.filePath}`} // ✅ direct Django file URL
                target="_blank"
                className="text-sm font-medium hover:underline"
              >
                {attachment.fileName}
              </Link>

              <div className="text-gray-500 text-xs">
                Uploaded by {attachment.uploadedBy} ·{" "}
                {new Date(
                  attachment.createdAt
                ).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}