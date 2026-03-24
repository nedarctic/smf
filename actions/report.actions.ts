"use server";

import { prisma } from "@/lib/prisma";
import { generateIncidentNumber, generateSecretCode } from "@/lib/incident";
import argon2 from "argon2";
import { randomUUID } from "crypto";
import { getAccessToken } from "@/actions/auth";

const PEPPER = process.env.INCIDENT_SECRET_PEPPER!;
const DJANGO_API_URL = process.env.DJANGO_API_URL!;

export type CreateIncidentState =
    | { success: false; error?: string }
    | { success: true; incidentNumber: string; secretCode: string };

type CreateIncidentInput = {
    reporterType: "Anonymous" | "Confidential" | "";
    category: string;
    description: string;
    location: string;
    involvedPeople?: string;
    incidentDate: string;
    duration?: string;
    files: FileList | null;
    name?: string;
    email?: string;
    phone?: string;
    companyId: string;
    slaDays: string | null;
};

export async function CreateIncident(
    input: CreateIncidentInput
): Promise<CreateIncidentState> {
    try {

        const token = await getAccessToken();

        if (!input.companyId) {
            return { success: false, error: "Company not resolved" };
        }

        const incidentId = randomUUID();
        const reporterId = randomUUID();
        const incidentNumber = generateIncidentNumber();
        const secretCode = generateSecretCode();
        const secretCodeHash = await argon2.hash(secretCode + PEPPER);

        const slaDays = Number(input.slaDays ?? 7);

        const deadlineAt = new Date();
        deadlineAt.setDate(deadlineAt.getDate() + slaDays);

        await prisma.incident.create({
            data: {
                id: incidentId,
                companyId: input.companyId,
                incidentIdDisplay: incidentNumber,
                category: input.category,
                description: input.description,
                location: input.location,
                involvedPeople: input.involvedPeople || null,
                incidentDate: new Date(input.incidentDate),
                reporterType: input.reporterType as "Anonymous" | "Confidential",
                status: "New",
                secretCodeHash,
                duration: input.duration || null,
                deadlineAt,
                reporter: {
                    create: {
                        id: reporterId,
                        name: input.name || null,
                        email: input.email || null,
                        phone: input.phone || null,
                    },
                }
            },
        })

        if (input.files && input.files.length > 0) {
            for (const file of Array.from(input.files)) {
                const uploadForm = new FormData();
                uploadForm.append("file", file);

                const res = await fetch(
                    `${DJANGO_API_URL}/api/upload/`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        body: uploadForm,
                    }
                );
                if (!res.ok) {
                    throw new Error("File upload failed");
                }

                const data = await res.json();
                
                // Save reference in Prisma
                await prisma.attachment.create({
                    data: {
                        incidentId,
                        uploadedBy: "Reporter",
                        fileName: file.name,
                        filePath: data.download_url, // ← Django returns file path
                    },
                })
            }
        }

        return {
            success: true,
            incidentNumber,
            secretCode,
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to submit incident. Please try again.",
        };
    }
}