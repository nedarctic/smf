"use client";

import { useEffect, useState } from "react";
import { IncidentDetailsSkeleton } from "./incident-details-skeleton";

export function IncidentDetails({
    incidentId,
}: {
    incidentId: string;
}) {
    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const res = await fetch(`/api/incidents/${incidentId}`);
                const data = await res.json();
                setIncident(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIncident();
    }, [incidentId]);

    if (loading) {
        return <div className="p-6">
            <IncidentDetailsSkeleton />;
        </div>
    }
    if (!incident) return <p className="p-4">Not found</p>;

    return (
        <div className="mt-4 space-y-4 text-sm flex flex-col 
    items-start justify-start p-10">

            <div>
                <p className="text-muted-foreground">ID</p>
                <p className="font-medium">{incident.incidentIdDisplay}</p>
            </div>

            <div>
                <p className="text-muted-foreground">Status</p>
                <p>{incident.status}</p>
            </div>

            <div>
                <p className="text-muted-foreground">Category</p>
                <p>{incident.category}</p>
            </div>

            <div>
                <p className="text-muted-foreground">Location</p>
                <p>{incident.location}</p>
            </div>

            <div>
                <p className="text-muted-foreground">Description</p>
                <p>{incident.description}</p>
            </div>

        </div>
    );
}