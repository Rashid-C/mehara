import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/data";
import { hashPassword } from "@/lib/password";
import { registerCustomer } from "@/auth";
import { validateRegistrationInput } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const validation = validateRegistrationInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const existing = await getUserByEmail(validation.data.email);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  try {
    await registerCustomer({
      name: validation.data.name,
      email: validation.data.email,
      passwordHash: hashPassword(validation.data.password),
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}
