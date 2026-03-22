import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { hashToken } from "@/lib/tokens";
import { revalidatePath } from "next/cache";
import { inviteUser } from "@/actions/team.actions";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const tokenHash = hashToken(token);

  const invite = await prisma.inviteToken.findFirst({ where: { tokenHash } });
  if (!invite || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: invite.userId },
    data: {
      password: await hashPassword(password),
      status: "Active",
    },
  });

  await prisma.inviteToken.delete({ where: { id: invite.id } });

  revalidatePath(`/dashboard/team/${invite.userId}`);

  return NextResponse.json({ success: true });
}