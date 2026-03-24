import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "@/actions/auth";

const DJANGO_API_URL = process.env.DJANGO_API_URL!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const incidentId = formData.get("incidentId") as string;
    const uploaderType = formData.get("uploaderType") as
      | "Handler"
      | "Reporter";

    if (!incidentId || !uploaderType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

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
          uploadedBy: uploaderType,
          fileName: file.name,
          filePath: data.download_url,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}