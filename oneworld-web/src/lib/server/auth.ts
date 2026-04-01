import { cookies } from "next/headers";
import { authCookieName, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/server/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;

  if (!token) return null;

  try {
    const payload = await verifySessionToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false as const,
      status: 401,
      error: "UNAUTHORIZED",
      message: "请先登录。",
      user: null,
    };
  }

  if (!user.isAdmin) {
    return {
      ok: false as const,
      status: 403,
      error: "FORBIDDEN",
      message: "当前账号无管理员权限。",
      user,
    };
  }

  return {
    ok: true as const,
    user,
  };
}
