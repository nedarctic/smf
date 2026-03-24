import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/actions/auth";
import { getServerSession } from "next-auth"; 
import { authOptions } from "../auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {

  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new NextResponse("Missing file URL", { status: 400 });
  }

  const token = await getAccessToken();

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = await fetch(fileUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return new NextResponse("Failed to fetch file", {
      status: res.status,
    });
  }

  const contentType =
    res.headers.get("content-type") || "application/octet-stream";

  const disposition =
    res.headers.get("content-disposition") ||
    `attachment; filename="download"`;

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
    },
  });
}