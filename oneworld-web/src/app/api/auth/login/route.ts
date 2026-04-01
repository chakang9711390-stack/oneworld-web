import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { authCookieName, createSessionToken, getSessionCookieOptions, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: "请输入邮箱和密码。" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "该账号不存在，请先注册。" }, { status: 404 });
  }

  const passwordMatched = await verifyPassword(password, user.passwordHash);
  if (!passwordMatched) {
    return NextResponse.json({ error: "密码不正确。" }, { status: 401 });
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  });

  const response = NextResponse.json({
    ok: true,
    message: `登录成功，欢迎回来，${user.nickname ?? user.email}。`,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      isAdmin: user.isAdmin,
    },
  });

  response.cookies.set(authCookieName, token, getSessionCookieOptions());
  return response;
}
