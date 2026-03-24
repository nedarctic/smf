import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "@/actions/auth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const companyId = formData.get("companyId") as string | null;

    if (!file || !companyId) {
      return NextResponse.json(
        { success: false, error: "Missing file or companyId" },
        { status: 400 }
      );
    }

    // ✅ 10MB limit
    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 10MB limit" },
        { status: 413 }
      );
    }

    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Upload to Django
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const res = await fetch(
      `${process.env.DJANGO_API_URL}/api/logos/upload/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { success: false, error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Save/update in DB
    const existing = await prisma.logo.findUnique({
      where: { companyId },
    });

    if (existing) {
      await prisma.logo.update({
        where: { companyId },
        data: {
          logoUrl: data.file,
          downloadUrl: data.download_url,
        },
      });
    } else {
      await prisma.logo.create({
        data: {
          companyId,
          logoUrl: data.file,
          downloadUrl: data.download_url,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logo upload error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}