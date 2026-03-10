import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) {
    return unauthorized;
  }

  if (process.env.VERCEL || process.env.LOCAL_UPLOADS_ENABLED === "false") {
    return NextResponse.json(
      { error: "Local filesystem uploads are disabled for this deployment. Configure UploadThing instead." },
      { status: 501 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".png";
  const fileName = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return NextResponse.json({
    url: `/uploads/products/${fileName}`,
    name: file.name,
  });
}
