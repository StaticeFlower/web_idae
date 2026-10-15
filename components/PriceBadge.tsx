import { formatPrice } from "@/lib/format";

export function PriceBadge({ price }: { price: number }) {
  const free = price <= 0;
  return (
    <span
      className={`shrink-0 rounded-full border-2 border-ink px-3 py-0.5 text-sm font-bold ${
        free ? "bg-teal-soft" : "bg-spark"
      }`}
    >
      {formatPrice(price)}
    </span>
  );
}
