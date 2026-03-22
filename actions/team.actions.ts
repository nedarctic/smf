"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/enums";

export async function updateUserRole(
  userId: string,
  role: UserRole
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

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

export async function deactivateUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "Inactive" },
    });

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