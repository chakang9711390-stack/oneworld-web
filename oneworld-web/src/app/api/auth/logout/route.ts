import { NextResponse } from "next/server";
import { authCookieName, getSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "已退出登录。" });
  response.cookies.set(authCookieName, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
