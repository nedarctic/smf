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
    avgResolutionTime,
    totalIncidentsTrend,
    totalOpenIncidentsTrend,
    slaComplianceTrend,
    avgResolutionTimeTrend,
    groupIncidentsByDate,
    getIncidents
} from '@/lib/helpers'

export default async function DashboardPage() {

    const res = await getCompanyId();
    const companyId = res.data!

    const total_incidents = await totalIncidents(companyId);
    const total_open_incidents = await totalOpenIncidents(companyId);
    const SLA_compliance = await SLACompliance(companyId);
    const unassigned_incidents = await unassignedIncidents(companyId);
    const avg_resolution_time = await avgResolutionTime(companyId);

    const incidentsTrend = await totalIncidentsTrend(companyId);
    const openTrend = await totalOpenIncidentsTrend(companyId);
    const slaTrend = await slaComplianceTrend(companyId);
    const resolutionTrend = await avgResolutionTimeTrend(companyId);

    const incidents = await getIncidents(companyId);
    const chartData = await groupIncidentsByDate(incidents);



    return (
        <div>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">


                        <SectionCards
                            totalIncidents={incidentsTrend.current}
                            prevTotalIncidents={incidentsTrend.previous}

                            totalOpenIncidents={openTrend.current}
                            prevTotalOpenIncidents={openTrend.previous}

                            SLACompliance={slaTrend.current}
                            prevSLACompliance={slaTrend.previous}

                            avgResolutionTime={resolutionTrend.current}
                            prevAvgResolutionTime={resolutionTrend.previous}
                        />

                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive chartData={chartData} />
                        </div>
                        <DataTable data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}