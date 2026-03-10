import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { updateStoreSettings } from "@/lib/data";

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const settings = await updateStoreSettings({
    taxPercentage: Math.max(0, Number(body.taxPercentage) || 0),
  });

  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/admin");

  return NextResponse.json(settings);
}
