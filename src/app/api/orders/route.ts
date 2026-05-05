import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { createOrder, getOrders, OrderCreationError } from "@/lib/data";
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

  let order;
  try {
    order = await createOrder(validation.data);
  } catch (error) {
    if (error instanceof OrderCreationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/collection");
  revalidatePath("/");

  return NextResponse.json(order, { status: 201 });
}
