import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
