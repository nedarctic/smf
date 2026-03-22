import { NewIncidentReportClient } from "./NewIncidentReportClient";
import { prisma } from "@/lib/prisma";

export async function getCategories(companyId: string) {
    const res = await prisma.category.findMany({
        where: {companyId: companyId}
    });
    return res;
}

export default async function NewReportingPage({ params }: { params: Promise<{ companyId: string }> }) {

    const { companyId } = await params;

    const categories = await getCategories(companyId);

    const reportingLink = await prisma.reportingPage.findUnique({
        where: {companyId: companyId}
    }).then(res => res?.reportingPageUrl)

    return <NewIncidentReportClient reportingLink={reportingLink!} categories={categories} />
}