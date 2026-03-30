import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET() {
  const items = await prisma.industry.findMany({
    where: {
      type: { in: ["opc", "both"] },
      status: "active",
    },
    orderBy: { sortOrder: "asc" },
    include: {
      opcProjectTemplates: true,
    },
  });

  return NextResponse.json({
    items: items.map((item) => ({
      name: item.name,
      slug: item.slug,
      description: item.description,
      count: item.opcProjectTemplates.length,
    })),
  });
}
