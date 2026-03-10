import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { createOrder, getOrders } from "@/lib/data";
import { validateOrderInput } from "@/lib/validation";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const validation = validateOrderInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const order = await createOrder(validation.data);

  revalidatePath("/admin");

  return NextResponse.json(order, { status: 201 });
}
