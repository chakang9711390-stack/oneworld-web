import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { requireAdmin } from "@/lib/server/auth";

export async function GET(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const { searchParams } = new URL(request.url);
  const industryId = searchParams.get("industryId");

  const items = await prisma.workflowRole.findMany({
    where: {
      status: "active",
      ...(industryId ? { industryId } : {}),
    },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      industryId: true,
    },
  });

  return NextResponse.json({ items });
}
