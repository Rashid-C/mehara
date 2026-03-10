import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/data";
import { validateOrderUpdateInput } from "@/lib/validation";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Context) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await params;
  const body = await request.json();
  const validation = validateOrderUpdateInput(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const order = await updateOrderStatus(id, validation.data.status, validation.data.paymentStatus);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  revalidatePath("/admin");

  return NextResponse.json(order);
}
