import ReportingClient from "./ReportingClient";
import { getReportingPage } from "@/lib/helpers";

export default async function ReportingPage() {
    const res = await getReportingPage();

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <ReportingClient data={res} />
        </div>
    )
}