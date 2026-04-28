"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/helpers";
import { logAuditAsync } from "@/lib/audit";

export async function updateSettings({
  companyName,
  name,
  email,
  password,
  slaDays,
}: {
  companyName: string;
  name: string;
  email: string;
  password?: string;
  slaDays: number;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const userId = session.user.id;

    const companyId = await getCompanyId().then((res) => res.data!);

    // =========================
    // Get previous values (for audit diff)
    // =========================
    const [previousCompany, previousUser] = await Promise.all([
      prisma.company.findUnique({
        where: { id: companyId },
        select: { name: true, slaDays: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
    ]);

    // =========================
    // UPDATE COMPANY
    // =========================
    await prisma.company.update({
      where: { id: companyId },
      data: {
        name: companyName,
        slaDays: slaDays.toString(),
      },
    });

    logAuditAsync({
      action: "UPDATE",
      entityType: "COMPANY",
      entityId: companyId,
      companyId,
      userId,
      description: "Company settings updated",
      metadata: {
        name: {
          from: previousCompany?.name,
          to: companyName,
        },
        slaDays: {
          from: previousCompany?.slaDays,
          to: slaDays.toString(),
        },
      },
    });

    // =========================
    // UPDATE USER
    // =========================
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    logAuditAsync({
      action: "UPDATE",
      entityType: "USER",
      entityId: userId,
      userId,
      companyId,
      description: "User profile updated",
      metadata: {
        name: {
          from: previousUser?.name,
          to: name,
        },
        email: {
          from: previousUser?.email,
          to: email,
        },
      },
    });

    // =========================
    // UPDATE PASSWORD (optional)
    // =========================
    if (password && password.trim().length > 0) {
      const hashedPassword = await hashPassword(password);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });

      logAuditAsync({
        action: "UPDATE",
        entityType: "USER",
        entityId: userId,
        userId,
        companyId,
        description: "User password changed",
        metadata: {
          passwordChanged: true,
        },
      });
    }

    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}