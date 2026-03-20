import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ incidentId: string }> }
) {
  try {
    const { incidentId } = await params;

    if (!incidentId) {
      return NextResponse.json(
        { error: "Incident ID is required" },
        { status: 400 }
      );
    }

    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: {
        handlers: true,
      },
    });

    if (!incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(incident, { status: 200 });

  } catch (error) {
    console.error("GET INCIDENT ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}