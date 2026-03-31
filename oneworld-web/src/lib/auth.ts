import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "oneworld_session";
const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 14;
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET ?? "oneworld-dev-session-secret-change-me";

export const authCookieName = AUTH_COOKIE_NAME;

function getSecretKey() {
  return new TextEncoder().encode(SESSION_SECRET);
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function createSessionToken(payload: { userId: string; email: string; nickname?: string | null }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRES_IN_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  const result = await jwtVerify(token, getSecretKey());
  return result.payload as {
    userId: string;
    email: string;
    nickname?: string | null;
    exp: number;
    iat: number;
  };
}

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_EXPIRES_IN_SECONDS,
  };
}

export async function getProviderRedirectUrl(provider: "google" | "apple") {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const routes = {
    google: "/auth/google",
    apple: "/auth/apple",
  } as const;

  return `${baseUrl}${routes[provider]}`;
}
