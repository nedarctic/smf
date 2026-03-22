// actions/reporting.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";

import { Prisma } from "@/lib/generated/prisma/client";

export async function updateReportingPage({
  slug,
  title,
  intro,
  policyUrl,
}: {
  slug: string;
  title: string;
  intro: string;
  policyUrl: string;
}) {
  try {
    const companyId = await getCompanyId().then(res => res.data!);

    // Update slug
    await prisma.company.update({
      where: { id: companyId },
      data: {
        reportingLinkSlug: slug,
      },
    });

    // Upsert reporting page
    await prisma.reportingPage.upsert({
      where: { companyId },
      update: {
        title,
        introContent: intro,
        policyUrl,
        reportingPageUrl: `/report/${slug}`,
      },
      create: {
        companyId,
        title,
        introContent: intro,
        policyUrl,
        reportingPageUrl: `/report/${slug}`,
      },
    });

    revalidatePath("/dashboard/reporting");

    return { success: true };

  } catch (error) {
    // ✅ Handle unique constraint violations explicitly
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "This reporting link is already in use. Please choose another slug.",
      };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}

export async function createCategory({
  name,
}: {
  name: string;
}) {
  try {
    const companyId = await getCompanyId().then(res => res.data!);

    await prisma.category.create({
      data: {
        companyId,
        categoryName: name,
      },
    });

    revalidatePath("/dashboard/reporting");

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}