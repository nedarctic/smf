import { prisma } from '@/lib/prisma';


export async function getCompany (reportingLink: string) {
  const company = await prisma.company.findUnique({
    where: {reportingLinkSlug: reportingLink}
  });
  return company;
}

export default async function ReportingPage(
  {
    params
  }: {
    params: Promise<{ reportingLink: string }>
  }) {
  const { reportingLink } = await params;

  const company = await getCompany(reportingLink);

  console.log("company at the reporting page:", company)

  return (
    <div>
      <p>{reportingLink}</p>
    </div>
  )
}