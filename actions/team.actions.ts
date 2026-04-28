"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/enums";
import { generateToken, hashToken } from "@/lib/tokens";
import { transporter } from "@/lib/mailer";
import { getCompanyId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { logAuditAsync } from "@/lib/audit";

// =========================
// UPDATE USER ROLE
// =========================
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const previous = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    logAuditAsync({
      action: "UPDATE",
      entityType: "USER",
      entityId: userId,
      userId,
      description: "User role updated",
      metadata: {
        from: previous?.role,
        to: role,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


// =========================
// DEACTIVATE USER
// =========================
export async function deactivateUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "Inactive" },
    });

    await prisma.inviteToken.deleteMany({ where: { userId } });

    logAuditAsync({
      action: "UPDATE",
      entityType: "USER",
      entityId: userId,
      userId,
      description: "User deactivated",
      metadata: {
        status: "Inactive",
      },
    });

    revalidatePath(`/dashboard/team/${userId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


// =========================
// INVITE USER
// =========================
export async function inviteUser({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  try {
    const companyId = await getCompanyId().then((res) => res.data!);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    // =========================
    // RESEND INVITE FLOW
    // =========================
    if (existing?.status === "Invited") {
      const userId = existing.id;

      await prisma.inviteToken.deleteMany({ where: { userId } });

      const rawToken = generateToken();
      const tokenHash = hashToken(rawToken);

      await prisma.user.update({
        where: { id: userId },
        data: { status: "Invited" },
      });

      await prisma.inviteToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      const link = `${process.env.NEXT_PUBLIC_APP_URL}/handler/invite/accept?token=${rawToken}`;

      await transporter.sendMail({
        from: `"SemaFacts" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Invite resent",
        html: `<a href="${link}">Accept Invite</a>`,
      });

      logAuditAsync({
        action: "UPDATE",
        entityType: "USER",
        entityId: userId,
        userId,
        companyId,
        description: "Invite resent",
      });

      return;
    }

    if (existing?.status === "Active") {
      return { error: "User already exists and is active" };
    }

    // =========================
    // CREATE USER
    // =========================
    const user = await prisma.user.create({
      data: {
        email,
        name,
        status: "Invited",
        companyId,
      },
    });

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    await prisma.inviteToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/handler/invite/accept?token=${rawToken}`;

    await transporter.sendMail({
      from: `"SemaFacts" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "You're invited",
      html: `<p>You have been invited.</p><a href="${link}">Accept Invite</a>`,
    });

    logAuditAsync({
      action: "CREATE",
      entityType: "USER",
      entityId: user.id,
      userId: user.id,
      companyId,
      description: "User invited",
      metadata: {
        email,
        name,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


// =========================
// RESEND INVITE
// =========================
export async function resendInvite(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    await prisma.inviteToken.deleteMany({ where: { userId } });

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { status: "Invited" },
    });

    await prisma.inviteToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/handler/invite/accept?token=${rawToken}`;

    await transporter.sendMail({
      from: `"SemaFacts" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Invite resent",
      html: `<a href="${link}">Accept Invite</a>`,
    });

    logAuditAsync({
      action: "UPDATE",
      entityType: "USER",
      entityId: user.id,
      userId: user.id,
      description: "Invite resent",
    });

    revalidatePath(`/dashboard/team/${user.id}`);
  } catch (error) {
    throw error;
  }
}


// =========================
// PASSWORD RESET
// =========================
export async function sendPasswordResetLink(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return;

    const userId = user.id;

    await prisma.inviteToken.deleteMany({ where: { userId } });

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    await prisma.user.update({
      where: { id: userId },
      data: { status: "Invited" },
    });

    await prisma.inviteToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/password/reset?token=${rawToken}`;

    await transporter.sendMail({
      from: `"SemaFacts" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password reset",
      html: `<a href="${link}">Click to reset password</a>`,
    });

    logAuditAsync({
      action: "UPDATE",
      entityType: "USER",
      entityId: userId,
      userId,
      description: "Password reset requested",
    });

    revalidatePath(`/dashboard/team/${userId}`);
  } catch (error) {
    console.error(error);
  }
}