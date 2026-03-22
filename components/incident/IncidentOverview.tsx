import { Incident } from "@/lib/generated/prisma/client";

export default function IncidentOverview({
  incident,
}: {
  incident: Incident;
}) {
  return (
    <section className="flex flex-col gap-12">
      <header className="flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-light">
          Incident {incident.incidentIdDisplay}
        </h1>

        <p className="text-gray-600 text-sm max-w-2xl">
          This page provides the current status of your report and
          secure communication.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 text-sm">
        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium">{incident.status}</p>
        </div>

        <div>
          <p className="text-gray-500">Category</p>
          <p className="font-medium">{incident.category}</p>
        </div>

        <div>
          <p className="text-gray-500">Location</p>
          <p className="font-medium">{incident.location}</p>
        </div>

        <div>
          <p className="text-gray-500">Incident date</p>
          <p className="font-medium">
            {new Date(
              incident.incidentDate
            ).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Reporter type</p>
          <p className="font-medium">{incident.reporterType}</p>
        </div>
      </div>

      <div className="max-w-3xl flex flex-col gap-4">
        <p className="text-gray-500 text-sm">Description</p>

        <p className="text-base whitespace-pre-wrap">
          {incident.description}
        </p>
      </div>
    </section>
  );
}