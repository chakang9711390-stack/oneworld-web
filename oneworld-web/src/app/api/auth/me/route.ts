import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET() {
  const user = await prisma.user.findFirst();

  return NextResponse.json(
    user
      ? {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        }
      : null,
  );
}
