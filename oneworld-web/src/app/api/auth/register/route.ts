import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string; nickname?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const nickname = body.nickname?.trim();

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "请填写有效邮箱，并输入至少 6 位密码。" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "该邮箱已注册，请直接登录。" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: `demo:${password}`,
      nickname: nickname || email.split("@")[0],
    },
  });

  return NextResponse.json({
    ok: true,
    message: `注册成功，欢迎你，${user.nickname ?? user.email}。`,
  });
}
