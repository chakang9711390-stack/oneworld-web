import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { SceneSourceType } from "@prisma/client";
import { requireAdmin } from "@/lib/server/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const { sceneId } = await params;
  const body = await request.json();

  const scene = await prisma.sceneDefinition.findUnique({
    where: { sceneId },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!scene) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  const latest = scene.versions[0];

  if (!latest) {
    return NextResponse.json({ message: "Scene version not found" }, { status: 404 });
  }

  const updated = await prisma.sceneVersion.update({
    where: { id: latest.id },
    data: {
      version: body.version ?? latest.version,
      sourceType:
        body.sourceType && Object.values(SceneSourceType).includes(body.sourceType)
          ? body.sourceType
          : latest.sourceType,
      maturityLevel: body.maturityLevel ?? latest.maturityLevel,
      validatedCustomersCount:
        typeof body.validatedCustomersCount === "number"
          ? body.validatedCustomersCount
          : latest.validatedCustomersCount,
      owner: body.owner ?? latest.owner,
      releaseNotes: body.releaseNotes ?? latest.releaseNotes,
    },
  });

  revalidatePath("/admin/scenes");
  revalidatePath(`/admin/scenes/${sceneId}`);
  revalidatePath(`/admin/scenes/${sceneId}/edit`);

  return NextResponse.json({ ok: true, item: updated });
}
