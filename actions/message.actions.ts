"use server";

import { prisma } from "@/lib/prisma";
import { z } from 'zod';

const sendMessageSchema = z.object({
    content: z.string().min(1, "Message required"),
});

export async function sendMessageAction(
    incidentId: string,
    senderId: string,
    message: string,
    senderType: "Handler" | "Reporter"
) {
    /* -----------------------------
     * Validate input
     * ----------------------------- */
    const parsedData = sendMessageSchema.safeParse({
        content: message.toString(),
    });

    if (!parsedData.success) {
        return {
            error: JSON.parse(parsedData.error.message)[0].message,
        };
    }

    const { content } = parsedData.data;

    try {
        /* -----------------------------
         * Persist with Prisma
         * ----------------------------- */
        await prisma.message.create({
            data: {
                incidentId,
                senderId,
                content,
                senderType,
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