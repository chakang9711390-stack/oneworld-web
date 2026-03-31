import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { authCookieName, verifySessionToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(authCookieName)?.value;

  if (!token) {
    return NextResponse.json(null);
  }

  try {
    const payload = await verifySessionToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      authProvider: user.authProvider,
    });
  } catch {
    return NextResponse.json(null);
  }
}
