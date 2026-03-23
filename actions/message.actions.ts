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
    console.log("Executing send message action...")
    /* -----------------------------
     * Validate input
     * ----------------------------- */
    const parsedData = sendMessageSchema.safeParse({
        content: message.toString(),
    });

    console.log("Parsed message data:", parsedData);

    if (!parsedData.success) {
        console.log("Parsing message data failed");

        return {
            error: JSON.parse(parsedData.error.message)[0].message,
        };
    }

    const { content } = parsedData.data;

    console.log("Parsed message content:", content)

    try {
        /* -----------------------------
         * Persist with Prisma
         * ----------------------------- */
        await prisma.message.create({
            data: {
                incidentId,
                userId: senderType === "Handler" ? senderId : null,
                reporterId: senderType === "Reporter" ? senderId : null,
                content,
                senderType,
            },
        }).then(res => console.log("Message successfully sent", res));;

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