"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import { getAccessToken } from "@/actions/auth";
import { logAuditAsync } from "@/lib/audit";


// =========================
// REPORTING PAGE UPDATE
// =========================
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
    const companyId = await getCompanyId().then((res) => res.data!);

    if (slug.includes("/")) {
      return { error: "Slug should not contain a slash (/)" };
    }

    const isSlugExists = await prisma.reportingPage.findUnique({
      where: { reportingPageUrl: slug },
    }).then((res) => res?.reportingPageUrl);

    if (isSlugExists) {
      return {
        error:
          "This reporting link is already in use by another company. Kindly choose another.",
      };
    }

    const previous = await prisma.company.findUnique({
      where: { id: companyId },
      select: { reportingLinkSlug: true },
    });

    await prisma.company.update({
      where: { id: companyId },
      data: {
        reportingLinkSlug: slug,
      },
    });

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

    // 🔥 AUDIT
    logAuditAsync({
      action: "UPDATE",
      entityType: "REPORTING_PAGE",
      entityId: companyId,
      companyId,
      description: "Reporting page updated",
      metadata: {
        slug: {
          from: previous?.reportingLinkSlug,
          to: slug,
        },
        title,
        policyUrl,
      },
    });

    revalidatePath("/dashboard/reporting");

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error:
          "This reporting link is already in use. Please choose another slug.",
      };
    }

    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


// =========================
// CREATE CATEGORY
// =========================
export async function createCategory({
  name,
}: {
  name: string;
}) {
  try {
    const companyId = await getCompanyId().then((res) => res.data!);

    const categoryNames = await prisma.category.findMany({
      where: { companyId },
    }).then((res) => res.map((cat) => cat.categoryName));

    const exists = categoryNames.some(
      (cat) => cat.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      return { error: "Category name already exists" };
    }

    const category = await prisma.category.create({
      data: {
        companyId,
        categoryName: name,
      },
    });

    // 🔥 AUDIT
    logAuditAsync({
      action: "CREATE",
      entityType: "CATEGORY",
      entityId: category.id,
      companyId,
      description: "Category created",
      metadata: {
        name,
      },
    });

    revalidatePath("/dashboard/reporting");

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


// =========================
// UPLOAD LOGO
// =========================
export async function uploadLogo(file: File, companyId: string) {
  const token = await getAccessToken();

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
        Authorization: `Bearer ${token}`,
      },
      body: uploadForm,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", res.status, errorText);
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();

  const existing = await prisma.logo.findUnique({
    where: { companyId },
  });

  const logo = existing
    ? await prisma.logo.update({
        where: { companyId },
        data: {
          logoUrl: data.file,
          downloadUrl: data.download_url,
        },
      })
    : await prisma.logo.create({
        data: {
          companyId,
          logoUrl: data.file,
          downloadUrl: data.download_url,
        },
      });

  // 🔥 AUDIT
  logAuditAsync({
    action: "UPLOAD_FILE",
    entityType: "COMPANY",
    entityId: companyId,
    companyId,
    description: "Company logo uploaded/updated",
    metadata: {
      fileName: file.name,
      logoUrl: data.file,
    },
  });

  return logo;
}