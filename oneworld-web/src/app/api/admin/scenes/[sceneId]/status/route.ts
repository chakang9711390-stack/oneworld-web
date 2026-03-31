import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { CommonStatus } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const body = await request.json();
  const nextStatus = body.status as CommonStatus | undefined;

  if (!nextStatus || !Object.values(CommonStatus).includes(nextStatus)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const scene = await prisma.sceneDefinition.findUnique({ where: { sceneId } });

  if (!scene) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  const updated = await prisma.sceneDefinition.update({
    where: { id: scene.id },
    data: { status: nextStatus },
  });

  revalidatePath("/admin/scenes");
  revalidatePath(`/admin/scenes/${sceneId}`);
  revalidatePath(`/admin/scenes/${sceneId}/edit`);
  revalidatePath("/scenes");
  revalidatePath(`/scenes/${sceneId}`);

  return NextResponse.json({ ok: true, item: updated });
}
