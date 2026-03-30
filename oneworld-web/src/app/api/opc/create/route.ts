import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "创建我的 OPC 功能即将开放，下一阶段将接入真实创建流程。",
  });
}
