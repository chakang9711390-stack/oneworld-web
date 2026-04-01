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
  const roleId = searchParams.get("roleId");

  const items = await prisma.workflowTemplate.findMany({
    where: {
      status: "active",
      ...(industryId ? { industryId } : {}),
      ...(roleId ? { roleId } : {}),
    },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      industryId: true,
      roleId: true,
    },
  });

  return NextResponse.json({ items });
}
