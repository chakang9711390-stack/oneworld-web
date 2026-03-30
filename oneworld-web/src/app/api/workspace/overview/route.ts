import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET() {
  const user = await prisma.user.findFirst({
    include: {
      workspaceProjects: true,
    },
  });

  const projects = user?.workspaceProjects ?? [];
  const opcCount = projects.filter((item) => item.sourceType === "opc").length;
  const workflowCount = projects.filter((item) => item.sourceType === "workflow").length;
  const projectCount = projects.length;

  return NextResponse.json({
    opcCount,
    workflowCount,
    projectCount,
    opcSummary: opcCount > 0 ? `${opcCount} 个已沉淀` : "暂无 OPC 资产",
    workflowSummary: workflowCount > 0 ? `${workflowCount} 个工作流记录` : "暂无工作流记录",
    projectSummary: projectCount > 0 ? `${projectCount} 个项目资产` : "暂无项目",
  });
}
