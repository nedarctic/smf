import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReportClient from "./ReportClient";

export default async function ReportingPage({
  params,
}: {
  params: Promise<{ reportingLink: string }>;
}) {
  const { reportingLink } = await params;

  // 1. Get company by slug
  const company = await prisma.company.findUnique({
    where: { reportingLinkSlug: reportingLink },
  });

  if (!company) return notFound();

  // 2. Get reporting page linked to that company
  const reportingPage = await prisma.reportingPage.findUnique({
    where: { companyId: company.id },
  });

  if (!reportingPage) return notFound();

  // 3. (Optional) Get categories like before
  const categories = await prisma.category.findMany({
    where: { companyId: company.id },
  });

  console.log("company:", company);
  console.log("reportingPage:", reportingPage);
  console.log("categories:", categories);

  // 4. Pass data to client component (similar to Drizzle version)
  return (
    <ReportClient
      companyId={company.id}
      title={reportingPage.title ?? ""}
      introContent={reportingPage.introContent ?? ""}
      policyUrl={reportingPage.policyUrl ?? ""}
      reportingPageUrl={reportingPage.reportingPageUrl ?? ""}
      reportingPageLink={reportingLink}
      categories={categories} // optional if needed
    />
  );
}