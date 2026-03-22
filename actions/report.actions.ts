"use server";

import { prisma } from "@/lib/prisma";
import { generateIncidentNumber, generateSecretCode } from "@/lib/incident";
import argon2 from "argon2";
import { randomUUID } from "crypto";
import { getCompanyId } from "@/lib/helpers";

const PEPPER = process.env.INCIDENT_SECRET_PEPPER!;
const DJANGO_API_URL = process.env.DJANGO_API_URL!; // e.g. http://localhost:8000/api

export type CreateIncidentState =
    | { success: false; error?: string }
    | { success: true; incidentNumber: string; secretCode: string };

export async function CreateIncident(
    _prevState: CreateIncidentState,
    formData: FormData
): Promise<CreateIncidentState> {
    try {
        /* -----------------------------
         * Resolve company
         * ----------------------------- */
        const response = await getCompanyId();
        const companyId = response?.data;

        if (!companyId) {
            return { success: false, error: "Company not resolved" };
        }

        /* -----------------------------
         * Extract form data
         * ----------------------------- */
        const reporterType = formData.get("reporterType") as
            | "Anonymous"
            | "Confidential";

        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const involvedPeople = formData.get("involvedPeople") as string | null;
        const incidentDate = formData.get("incidentDate") as string;
        const duration = formData.get("duration") as string;

        const name = formData.get("name") as string | null;
        const email = formData.get("email") as string | null;
        const phone = formData.get("phone") as string | null;

        const files = formData.getAll("files") as File[];

        /* -----------------------------
         * Generate identifiers
         * ----------------------------- */
        const incidentId = randomUUID();

        const incidentNumber = generateIncidentNumber();
        const secretCode = generateSecretCode();
        const secretCodeHash = await argon2.hash(secretCode + PEPPER);

        /* -----------------------------
         * Create Incident + Reporter
         * ----------------------------- */
        await prisma.incident.create({
            data: {
                id: incidentId,
                companyId,
                incidentIdDisplay: incidentNumber,
                category,
                description,
                location,
                involvedPeople,
                incidentDate: new Date(incidentDate),
                reporterType,
                status: "New",
                secretCodeHash,
                duration,

                reporter:
                    reporterType === "Confidential"
                        ? {
                            create: {
                                name,
                                email,
                                phone,
                            },
                        }
                        : undefined,
            },
        });

        /* -----------------------------
     * Upload attachments to Django
     * ----------------------------- */
        if (files.length > 0) {
            for (const file of files) {
                const uploadForm = new FormData();
                uploadForm.append("file", file);

                const res = await fetch(
                    `${process.env.DJANGO_API_URL}/api/upload/`,
                    {
                        method: "POST",
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
                        filePath: data.file, // ← Django returns file path
                    },
                });
            }
        }

        console.log({
            success: true,
            incidentNumber,
            secretCode,
        });

        return {
            success: true,
            incidentNumber,
            secretCode,
        };
    } catch (error) {
        console.error("CreateIncident failed:", error);
        return {
            success: false,
            error: "Failed to submit incident. Please try again.",
        };
    }
}