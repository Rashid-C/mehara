"use client";

import { ChangeEvent, useRef, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

export function ProductImageUpload({
  image,
  onUploaded,
  onRemove,
  uploadThingEnabled,
  localUploadEnabled,
}: {
  image: string;
  onUploaded: (url: string) => void;
  onRemove: () => void;
  uploadThingEnabled: boolean;
  localUploadEnabled: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleLocalFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/product", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setUploading(false);
      setMessage("Local upload failed.");
      return;
    }

    const result = await response.json();
    onUploaded(result.url);
    setUploading(false);
    setMessage("Image uploaded from your system.");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-[var(--color-sand)] bg-[var(--color-blush)]/40 px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-[var(--color-ink)]">Product image</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Upload from the admin system only. No image link input is required.</p>
      </div>

      {image ? (
        <div className="rounded-[1.5rem] border border-[var(--color-sand)] bg-white p-3 shadow-[0_12px_28px_rgba(214,76,139,0.06)]">
          <div className="h-56 rounded-[1.25rem] bg-[var(--color-blush)] bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          <div className="mt-3 flex flex-wrap gap-3">
            {localUploadEnabled ? (
              <label className="rounded-full bg-[var(--color-mocha)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(214,76,139,0.18)]">
                Replace image
                <input ref={inputRef} type="file" accept="image/*" onChange={handleLocalFile} className="hidden" />
              </label>
            ) : null}
            <button
              type="button"
              onClick={onRemove}
              className="rounded-full border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-muted)]"
            >
              Remove image
            </button>
          </div>
        </div>
      ) : localUploadEnabled ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-[var(--color-sand)] bg-white px-6 py-10 text-center shadow-[0_12px_28px_rgba(214,76,139,0.06)]">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Choose image from your computer</span>
          <span className="mt-2 text-sm text-[var(--color-muted)]">JPG, PNG, or WEBP product images work best.</span>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleLocalFile} className="hidden" />
        </label>
      ) : (
        <div className="rounded-[1.5rem] border border-[var(--color-sand)] bg-white px-6 py-6 text-sm text-[var(--color-muted)]">
          Local filesystem uploads are disabled for this deployment. Use UploadThing for product images on Vercel.
        </div>
      )}

      {uploading ? <p className="text-sm text-[var(--color-mocha)]">Uploading...</p> : null}
      {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}

      {uploadThingEnabled ? (
        <div className="border-t border-[var(--color-sand)] pt-3">
          <p className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Or upload with UploadThing</p>
          <UploadButton
            endpoint="productImage"
            appearance={{
              button:
                "ut-ready:bg-[#d64c8b] ut-uploading:cursor-not-allowed ut-ready:hover:bg-[#341f29] rounded-full px-5 py-3 text-sm font-semibold text-white",
              allowedContent: "hidden",
            }}
            content={{
              button: "Upload with UploadThing",
            }}
            onClientUploadComplete={(files) => {
              if (files[0]?.ufsUrl) {
                onUploaded(files[0].ufsUrl);
                setMessage("Image uploaded with UploadThing.");
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
