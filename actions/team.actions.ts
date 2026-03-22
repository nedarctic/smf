"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/enums";
import { generateToken, hashToken } from "@/lib/tokens";
import { transporter } from "@/lib/mailer";
import { z } from 'zod';
import { getCompanyId } from "@/lib/helpers";

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

export async function inviteUser({
    email,
    name,
}: {
    email: string;
    name: string;
}) {

    // get company id
    const companyId = await getCompanyId()
        .then(res => res.data!)

    // 1. Create user
    const user = await prisma.user.create({
        data: {
            email,
            name,
            status: "Invited",
            companyId
        },
    });

    // 2. Generate token
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    // 3. Store token
    await prisma.inviteToken.create({
        data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });

    // 4. Create link
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/handler/invite/accept?token=${rawToken}`;

    await transporter.verify().then(res => console.log("SMTP is ready"));

    // 5. Send email
    try {
        const info = await transporter.sendMail({
            from: `"SemaFacts" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "You're invited",
            html: `
      <p>You have been invited.</p>
      <a href="${link}">Accept Invite</a>
    `,
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Email failed:", error);
    }

    return { success: true };
}

export async function resendInvite(userId: string) {
    await prisma.inviteToken.deleteMany({ where: { userId } });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error("User not found");

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

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
}
