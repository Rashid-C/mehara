import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { createProduct, getCatalogProducts, getProducts } from "@/lib/data";
import { validateProductInput } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const useCatalogQuery = searchParams.has("q") || searchParams.has("category") || searchParams.has("size") || searchParams.has("sort") || searchParams.has("page");

  if (!useCatalogQuery) {
    const products = await getProducts();
    return NextResponse.json(products);
  }

  const result = await getCatalogProducts({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    size: searchParams.get("size") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: Number(searchParams.get("page") ?? "1"),
    pageSize: Number(searchParams.get("pageSize") ?? "12"),
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const validation = validateProductInput(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const product = await createProduct(validation.data);

    revalidatePath("/");
    revalidatePath("/collection");
    revalidatePath("/admin");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    }

    throw error;
  }
}
