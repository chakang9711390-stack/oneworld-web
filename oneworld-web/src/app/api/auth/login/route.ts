import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: "请输入邮箱和密码。" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "该账号不存在，请先注册。" }, { status: 404 });
  }

  if (user.passwordHash !== `demo:${password}`) {
    return NextResponse.json({ error: "密码不正确。" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    message: `登录成功，当前账号：${user.nickname ?? user.email}。`,
  });
}
