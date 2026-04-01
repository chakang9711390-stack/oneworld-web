import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { authCookieName, createSessionToken, getSessionCookieOptions, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string; nickname?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const nickname = body.nickname?.trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "请输入有效的邮箱地址。" }, { status: 400 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "密码至少 8 位。" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "该邮箱已注册，请直接登录。" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nickname: nickname || email.split("@")[0],
      authProvider: "email",
    },
  });

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  });

  const response = NextResponse.json({
    ok: true,
    message: `注册成功，欢迎你，${user.nickname ?? user.email}。`,
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
