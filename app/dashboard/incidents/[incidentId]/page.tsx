import { AppBreadcrumb } from "@/components/breadcrumb";

export default async function ({
    params
}: {
    params: Promise<{ incidentId: string }>
}) {

    const { incidentId } = await params;

    return (
        <div className="flex flex-col items-center 
        justify-start min-h-screen w-full px-10 py-16">
            <div className="flex flex-col items-start 
            gap-8 w-4/5">

                <AppBreadcrumb
                    items={[
                        { label: "Home", href: "/dashboard" },
                        { label: "Incidents", href: "/dashboard/incidents" },
                        { label: "Incident details" },
                    ]}
                />
                <p className="text-lg font-bold">{incidentId}</p>
            </div>

        </div>
    );
}