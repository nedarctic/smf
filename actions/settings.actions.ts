// actions/settings.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getCompanyId } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/helpers";

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
    // 1. Get session user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const userId = session.user.id;

    // 2. Get company
    const companyId = await getCompanyId().then(res => res.data!);

    // 3. Update company
    await prisma.company.update({
      where: { id: companyId },
      data: {
        name: companyName,
        slaDays: slaDays.toString(),
      },
    });

    // 4. Update user (basic info)
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    // 5. Update password (only if provided)
    if (password && password.trim().length > 0) {
      const hashedPassword = await hashPassword(password);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
    }

    // 6. Revalidate
    revalidatePath("/dashboard/settings");

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