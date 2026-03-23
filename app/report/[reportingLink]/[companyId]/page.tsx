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

    const slaDays = await prisma.company.findUnique({
        where: {id: companyId}
    }).then(res => res?.slaDays);

    const reportingLink = await prisma.reportingPage.findUnique({
        where: {companyId: companyId}
    }).then(res => res?.reportingPageUrl)

    const logoUrl = await prisma.logo.findUnique({
        where: {companyId: companyId}
    }).then(res => res && res.logoUrl)

    const reportingPageDetails = await prisma.reportingPage.findUnique({
        where: {companyId: companyId}
    })

    console.log("Logo URL:", logoUrl)

    return <NewIncidentReportClient reportingPageDetails={reportingPageDetails} logoUrl={logoUrl} slaDays={slaDays!} reportingLink={reportingLink!} categories={categories} />
}