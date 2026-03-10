import { getProductBackground } from "@/lib/product-image";

export function ProductGallery({ image, name }: { image: string; name: string }) {
  return (
    <div className="space-y-4">
      <div
        className="h-[32rem] rounded-[2rem] border border-[var(--color-sand)] bg-cover bg-center shadow-[0_22px_70px_rgba(84,58,46,0.09)]"
        style={{ backgroundImage: getProductBackground(image, name, "rgba(44,30,24,0.12)") }}
        aria-label={name}
      />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-32 rounded-[1.5rem] border border-[var(--color-sand)] bg-cover bg-center"
            style={{ backgroundImage: getProductBackground(image, name, "rgba(44,30,24,0.18)") }}
          />
        ))}
      </div>
    </div>
  );
}
