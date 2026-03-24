// actions/reporting.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";

import { Prisma } from "@/lib/generated/prisma/client";
import { POST } from "@/app/api/handler/activate/route";

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

export async function uploadLogo(file: File, companyId: string) {

  const logo = await prisma.logo.findUnique({
    where: { companyId: companyId }
  })

  if (logo) {

    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const res = await fetch(
      `${process.env.DJANGO_API_URL}/api/logos/upload/`,
      {
        method: "POST",
        body: uploadForm,
      }
    );
    if (!res.ok) {
      throw new Error("File upload failed");
    }

    const data = await res.json();
    await prisma.logo.update({
      where: { companyId: companyId },
      data: {
        logoUrl: data.file,
        downloadUrl: data.download_url,
      },
    })
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file);

  const res = await fetch(
    `${process.env.DJANGO_API_URL}/api/logos/upload/`,
    {
      method: "POST",
      body: uploadForm,
    }
  );
  if (!res.ok) {
    throw new Error("File upload failed");
  }

  const data = await res.json();

  await prisma.logo.create({
    data: {
      companyId: companyId,
      logoUrl: data.file,
      downloadUrl: data.download_url,
    }
  })
}