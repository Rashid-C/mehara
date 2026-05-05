import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "mehara_admin_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;
const MIN_SECRET_LENGTH = 32;

function getRequiredEnv(name: "SESSION_SECRET" | "ADMIN_EMAIL" | "ADMIN_PASSWORD") {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function getSessionSecret() {
  const secret = getRequiredEnv("SESSION_SECRET");
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`);
  }

  return secret;
}

function getAdminEmail() {
  return getRequiredEnv("ADMIN_EMAIL").toLowerCase();
}

function getAdminPassword() {
  return getRequiredEnv("ADMIN_PASSWORD");
}

function timingSafeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function buildToken(email: string) {
  const payload = `${email}:${sign(email)}`;
  return Buffer.from(payload, "utf8").toString("base64url");
}

function verifyToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, signature] = decoded.split(":");

    if (!email || !signature) {
      return false;
    }

    const expected = sign(email);
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? verifyToken(token) : false;
}

export async function requireAdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

export async function requireAdminApi() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, buildToken(getAdminEmail()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function validateAdminCredentials(email: string, password: string) {
  return timingSafeStringEqual(email.trim().toLowerCase(), getAdminEmail()) && timingSafeStringEqual(password, getAdminPassword());
}

export const authConfig = {
  sessionCookie: SESSION_COOKIE,
};
