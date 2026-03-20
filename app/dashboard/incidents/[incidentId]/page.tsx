import { AppBreadcrumb } from "@/components/breadcrumb";
import { getIncidentDetails } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ({
    params
}: {
    params: Promise<{ incidentId: string }>
}) {

    const { incidentId } = await params;
    const incident = await getIncidentDetails(incidentId);

    if (!incident) {
        return <p className="p-10">Incident not found</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full px-10 py-16">
            <div className="flex flex-col items-start gap-8 w-11/12">

                <AppBreadcrumb
                    items={[
                        { label: "Home", href: "/dashboard" },
                        { label: "Incidents", href: "/dashboard/incidents" },
                        { label: "Incident details" },
                    ]}
                />

                {/* HEADER */}
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-bold">
                        {incident.incidentIdDisplay}
                    </h1>
                    <Badge variant="outline">
                        {incident.status}
                    </Badge>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

                    {/* LEFT: MAIN DETAILS */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {incident.description}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Incident Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 text-sm">

                                <div>
                                    <p className="text-muted-foreground">Category</p>
                                    <p className="font-medium">{incident.category}</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">Location</p>
                                    <p className="font-medium">{incident.location}</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">Incident Date</p>
                                    <p className="font-medium">
                                        {incident.incidentDate.toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">Reporter Type</p>
                                    <p className="font-medium">{incident.reporterType}</p>
                                </div>

                                {incident.involvedPeople && (
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground">Involved People</p>
                                        <p className="font-medium">{incident.involvedPeople}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: META + HANDLERS */}
                    <div className="flex flex-col gap-6">

                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">

                                <div>
                                    <p className="text-muted-foreground">Created</p>
                                    <p>{incident.createdAt.toLocaleString()}</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">Updated</p>
                                    <p>{incident.updatedAt.toLocaleString()}</p>
                                </div>

                                {incident.closedAt && (
                                    <div>
                                        <p className="text-muted-foreground">Closed</p>
                                        <p>{incident.closedAt.toLocaleString()}</p>
                                    </div>
                                )}

                                {incident.deadlineAt && (
                                    <div>
                                        <p className="text-muted-foreground">Deadline</p>
                                        <p>{incident.deadlineAt.toLocaleString()}</p>
                                    </div>
                                )}

                                {incident.duration && (
                                    <div>
                                        <p className="text-muted-foreground">Duration</p>
                                        <p>{incident.duration}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Handlers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {incident.handlers.length === 0 ? (
                                    <p className="text-muted-foreground">No handlers assigned</p>
                                ) : (
                                    incident.handlers.map((handler) => (
                                        <div
                                            key={handler.id}
                                            className="flex justify-between border-b pb-2"
                                        >
                                            <span>{handler.handlerId}</span>
                                            <span className="text-muted-foreground">
                                                {handler.assignedAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}