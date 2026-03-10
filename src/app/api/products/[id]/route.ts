import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { deleteProduct, updateProduct } from "@/lib/data";
import { validateProductInput } from "@/lib/validation";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Context) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await params;
  const body = await request.json();
  const validation = validateProductInput(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  let product;
  try {
    product = await updateProduct(id, validation.data);
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    }

    throw error;
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/collection");
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/admin");

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Context) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await params;
  const existing = await deleteProduct(id);

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/collection");
  if (existing?.slug) {
    revalidatePath(`/product/${existing.slug}`);
  }
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}
