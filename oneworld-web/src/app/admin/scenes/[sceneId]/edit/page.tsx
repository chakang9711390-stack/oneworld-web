import { notFound } from "next/navigation";
import { SectionCard, SimpleBreadcrumb } from "@/components/shared/section";
import { getSceneDetail } from "@/lib/api";
import { AdminSceneEditForm } from "./scene-edit-form";

export default async function AdminSceneEditPage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const scene = await getSceneDetail(sceneId);

  if (!scene) notFound();

  return (
    <div className="grid gap-6">
      <SectionCard
        title={`编辑场景｜${scene.name}`}
        description="当前已接入真实保存接口，可直接修改核心字段。"
        extra={
          <SimpleBreadcrumb
            items={[
              { label: "管理后台", href: "/admin/scenes" },
              { label: "场景管理", href: "/admin/scenes" },
              { label: scene.name, href: `/admin/scenes/${scene.sceneId}` },
              { label: "编辑" },
            ]}
          />
        }
      />

      <AdminSceneEditForm
        scene={{
          sceneId: scene.sceneId,
          name: scene.name,
          description: scene.description,
          marketingSummary: scene.marketingSummary,
          businessGoal: scene.businessGoal,
          painPoint: scene.painPoint,
          inputMaterials: scene.inputMaterials,
          outputResult: scene.outputResult,
          triggerType: scene.triggerType,
          cadence: scene.cadence,
          automationLevel: scene.automationLevel,
          riskLevel: scene.riskLevel,
          launchPriority: scene.launchPriority,
          toolchainList: scene.executionConfig?.toolchainList ?? "",
          authRequiredList: scene.authConfig?.authRequiredList ?? "",
          humanConfirmationPoints: scene.riskRule?.humanConfirmationPoints ?? "",
          exceptionRules: scene.riskRule?.exceptionRules ?? "",
        }}
      />
    </div>
  );
}
