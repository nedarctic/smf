import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json";
import { 
    getCompanyId,
    totalIncidents, 
    totalOpenIncidents,
    SLACompliance,
    unassignedIncidents,
    avgResolutionTime
} from '@/lib/helpers'

export default async function DashboardPage() {

    const companyId = await getCompanyId();
    const total_incidents = await totalIncidents(companyId.data!);
    const total_open_incidents = await totalOpenIncidents(companyId.data!);
    const SLA_compliance = await SLACompliance(companyId.data!);
    const unassigned_incidents = await unassignedIncidents(companyId.data!);
    const avg_resolution_time = await avgResolutionTime(companyId.data!);

    return (
        <div>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        

                        <SectionCards 
                        totalIncidents={total_incidents} 
                        totalOpenIncidents={total_open_incidents}
                        SLACompliance={SLA_compliance}
                        unassignedIncidents={unassigned_incidents.length}
                        avgResolutionTime={avg_resolution_time}
                        />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        <DataTable data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}