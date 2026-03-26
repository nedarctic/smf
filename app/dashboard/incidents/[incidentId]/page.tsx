import { AppBreadcrumb } from "@/components/breadcrumb";
import { getIncidentDetails, getHandlers, getIncidentHandler } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReassignHandlerDialog } from "@/components/reassign-handler-dialogue";
import { UpdateStatusDialogue } from "@/components/update-status";
import { UpdateDeadlineDialogue } from "@/components/update-deadline-dialogue";
import { CloseIncidentDialogue } from "@/components/close-incident-dialogue";

export default async function ({
    params,
}: {
    params: Promise<{ incidentId: string }>;
}) {
    const { incidentId } = await params;
    const incident = await getIncidentDetails(incidentId);
    const handlers = await getHandlers();
    const handlersIds = incident?.handlers;

    const incidentHandlers = handlersIds?.map(handlerId => {
        return handlers.filter(handler => {
            return handler.id == handlerId.handlerId
        })[0]
    });
    
    if (!incident) {
        return <p className="p-10">Incident not found</p>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">

            {/* Breadcrumb */}
            <AppBreadcrumb
                items={[
                    { label: "Home", href: "/dashboard" },
                    { label: "Incidents", href: "/dashboard/incidents" },
                    { label: "Incident details" },
                ]}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                        {incident.incidentIdDisplay}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Created {incident.createdAt.toLocaleString()}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">{incident.status}</Badge>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            {incident.description}
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6 text-sm">

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
                                    {incident.incidentDate.toLocaleDateString(undefined, {timeZoneName: "short"})}
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
                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">

                            <div>
                                <p className="text-muted-foreground">Created</p>
                                <p>{incident.createdAt.toLocaleString(undefined, {timeZoneName: "short"})}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Updated</p>
                                <p>{incident.updatedAt.toLocaleString(undefined, {timeZoneName: "short"})}</p>
                            </div>

                            {incident.closedAt && (
                                <div>
                                    <p className="text-muted-foreground">Closed</p>
                                    <p>{incident.closedAt.toLocaleString(undefined, {timeZoneName: "short"})}</p>
                                </div>
                            )}

                            {incident.deadlineAt && (
                                <div>
                                    <p className="text-muted-foreground">Deadline</p>
                                    <p>{incident.deadlineAt.toLocaleString(undefined, {timeZoneName: "short"})}</p>
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-2">

                            <ReassignHandlerDialog incident={incident} currentHandlers={incidentHandlers!} handlers={handlers} />

                            <UpdateStatusDialogue incident={incident} activeStatus={incident.status}/>

                            <UpdateDeadlineDialogue incident={incident} deadlineAt={incident.deadlineAt!} />

                        </CardContent>
                    </Card>



                    {/* Handlers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Handlers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {incident.handlers.length === 0 ? (
                                <p className="text-muted-foreground">
                                    No handlers assigned
                                </p>
                            ) : (
                                incidentHandlers?.map((handler) => (
                                    <div
                                        key={handler.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="font-medium">
                                            {handler.name}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}