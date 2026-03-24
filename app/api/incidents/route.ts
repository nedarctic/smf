import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIncidentNumber, generateSecretCode } from "@/lib/incident";
import argon2 from "argon2";
import { randomUUID } from "crypto";
import { getAccessToken } from "@/actions/auth";

const PEPPER = process.env.INCIDENT_SECRET_PEPPER!;
const DJANGO_API_URL = process.env.DJANGO_API_URL!;

export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();

    // Extract fields
    const reporterType = formData.get("reporterType") as
      | "Anonymous"
      | "Confidential"
      | "";

    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const involvedPeople = formData.get("involvedPeople") as string;
    const incidentDate = formData.get("incidentDate") as string;
    const duration = formData.get("duration") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const companyId = formData.get("companyId") as string;
    const slaDays = formData.get("slaDays") as string;

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Company not resolved" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    const incidentId = randomUUID();
    const reporterId = randomUUID();
    const incidentNumber = generateIncidentNumber();
    const secretCode = generateSecretCode();
    const secretCodeHash = await argon2.hash(secretCode + PEPPER);

    const sla = Number(slaDays ?? 7);

    const deadlineAt = new Date();
    deadlineAt.setDate(deadlineAt.getDate() + sla);

    // Create incident
    await prisma.incident.create({
      data: {
        id: incidentId,
        companyId,
        incidentIdDisplay: incidentNumber,
        category,
        description,
        location,
        involvedPeople: involvedPeople || null,
        incidentDate: new Date(incidentDate),
        reporterType: reporterType as "Anonymous" | "Confidential",
        status: "New",
        secretCodeHash,
        duration: duration || null,
        deadlineAt,
        reporter: {
          create: {
            id: reporterId,
            name: name || null,
            email: email || null,
            phone: phone || null,
          },
        },
      },
    });

    // Handle files
    const files = formData.getAll("files") as File[];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const res = await fetch(`${DJANGO_API_URL}/api/upload/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadForm,
        });

        if (!res.ok) {
          throw new Error("File upload failed");
        }

        const data = await res.json();

        await prisma.attachment.create({
          data: {
            incidentId,
            uploadedBy: "Reporter",
            fileName: file.name,
            filePath: data.download_url,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      incidentNumber,
      secretCode,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit incident. Please try again." },
      { status: 500 }
    );
  }
}