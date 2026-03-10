import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "mehara_admin_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "change-mehara-session-secret";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "admin@mehara.local";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "Admin123!";
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
  return email === getAdminEmail() && password === getAdminPassword();
}

export const authConfig = {
  sessionCookie: SESSION_COOKIE,
  defaultAdminEmail: getAdminEmail(),
};
