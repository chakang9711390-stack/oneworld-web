import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "生成我的工作流功能即将开放，下一阶段将接入真实生成流程。",
  });
}
