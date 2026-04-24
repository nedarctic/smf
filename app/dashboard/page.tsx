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

import { getAccessToken } from "@/actions/auth";

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

    const incidents = await getIncidents(companyId, {limit: 15});
    const chartData = await groupIncidentsByDate(incidents);

    return (
        <div>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">


                        <SectionCards
                            currentTotalIncidents={incidentsTrend.current}
                            prevTotalIncidents={incidentsTrend.previous}
                            totalIncidents={total_incidents}

                            currentOpenIncidents={openTrend.current}
                            prevTotalOpenIncidents={openTrend.previous}
                            totalOpenIncidents={total_open_incidents}

                            currentSLACompliance={slaTrend.current}
                            prevSLACompliance={slaTrend.previous}
                            SLACompliance={SLA_compliance}

                            currentAvgResolutionTime={resolutionTrend.current}
                            prevAvgResolutionTime={resolutionTrend.previous}
                            avgResolutionTime={avg_resolution_time}
                        />

                        <DataTable data={incidents} />

                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive chartData={chartData} />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}