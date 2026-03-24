"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";

import { Prisma } from "@/lib/generated/prisma/client";
import { getAccessToken, getAuthTokens } from "@/actions/auth";

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
    // Handle unique constraint violations explicitly
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
  console.log("Executing upload logo server action");

  const token = await getAccessToken();
  console.log("Access token inside uploadLogo action:", token);

  if (!token) {
    throw new Error("No access token");
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file);

  const res = await fetch(
    `${process.env.DJANGO_API_URL}/api/logos/upload/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ FIXED
      },
      body: uploadForm,
    }
  );

  if (!res.ok) {
    const errorText = await res.text(); // ✅ DEBUG
    console.error("Upload failed:", res.status, errorText);
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();

  const existing = await prisma.logo.findUnique({
    where: { companyId },
  });

  if (existing) {
    await prisma.logo.update({
      where: { companyId },
      data: {
        logoUrl: data.file,
        downloadUrl: data.download_url,
      },
    });
  } else {
    await prisma.logo.create({
      data: {
        companyId,
        logoUrl: data.file,
        downloadUrl: data.download_url,
      },
    });
  }
}