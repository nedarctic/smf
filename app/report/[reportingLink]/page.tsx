import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReportClient from "./ReportClient";

export default async function ReportingPage({
  params,
}: {
  params: Promise<{ reportingLink: string }>;
}) {
  const { reportingLink } = await params;

  const company = await prisma.company.findUnique({
    where: { reportingLinkSlug: reportingLink },
  });

  if (!company) return notFound();

  const reportingPage = await prisma.reportingPage.findUnique({
    where: { companyId: company.id },
  });

  if (!reportingPage) return notFound();

  const categories = await prisma.category.findMany({
    where: { companyId: company.id },
  });

  const logoUrl = await prisma.logo.findUnique({
    where: {companyId: company.id}
  }).then(res => res?.logoUrl)
  
  
  return (
    <ReportClient
      companyId={company.id}
      title={reportingPage.title ?? ""}
      introContent={reportingPage.introContent ?? ""}
      policyUrl={reportingPage.policyUrl ?? ""}
      reportingPageUrl={reportingPage.reportingPageUrl ?? ""}
      reportingPageLink={reportingLink}
      categories={categories}
      logoUrl={logoUrl!}
    />
  );
}