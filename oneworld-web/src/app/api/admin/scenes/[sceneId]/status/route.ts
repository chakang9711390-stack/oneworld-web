import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { CommonStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/server/auth";
import { syncWorkflowSceneWithSceneStatus } from "@/server/scene-publishing";

export async function PATCH(request: Request, { params }: { params: Promise<{ sceneId: string }> }) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const { sceneId } = await params;
  const body = await request.json();
  const nextStatus = body.status as CommonStatus | undefined;

  if (!nextStatus || !Object.values(CommonStatus).includes(nextStatus)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  let updated;

  try {
    updated = await syncWorkflowSceneWithSceneStatus(sceneId, nextStatus);
  } catch (error) {
    if (error instanceof Error && error.message === "SCENE_NOT_FOUND") {
      return NextResponse.json({ message: "Scene not found" }, { status: 404 });
    }

    throw error;
  }

  revalidatePath("/admin/scenes");
  revalidatePath(`/admin/scenes/${sceneId}`);
  revalidatePath(`/admin/scenes/${sceneId}/edit`);
  revalidatePath("/scenes");
  revalidatePath(`/scenes/${sceneId}`);

  return NextResponse.json({ ok: true, item: updated });
}
