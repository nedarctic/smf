"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logAuditAsync } from "@/lib/audit";

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message required"),
});

export async function sendMessageAction(
  incidentId: string,
  senderId: string,
  message: string,
  senderType: "Handler" | "Reporter"
) {
  const parsedData = sendMessageSchema.safeParse({
    content: message.toString(),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues?.[0]?.message ?? "Invalid message",
    };
  }

  const { content } = parsedData.data;

  try {
    const msg = await prisma.message.create({
      data: {
        incidentId,
        userId: senderType === "Handler" ? senderId : null,
        reporterId: senderType === "Reporter" ? senderId : null,
        content,
        senderType,
      },
    });

    // 🔥 AUDIT LOG (non-blocking)
    logAuditAsync({
      action: "SEND_MESSAGE",
      entityType: "MESSAGE",
      entityId: msg.id,
      incidentId,
      userId: senderType === "Handler" ? senderId : null,
      description: "Message sent",
      metadata: {
        senderType,
        contentLength: content.length,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Send message failed:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to send message",
    };
  }
}