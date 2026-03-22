import ReportingClient from "./ReportingClient";
import { getReportingPage } from "@/lib/helpers";

export default async function ReportingPage () {
    const res = await getReportingPage();

    return <ReportingClient data={res} />
}