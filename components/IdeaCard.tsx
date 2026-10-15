import Link from "next/link";
import type { IdeaWithSeller } from "@/types";
import { formatDate, formatPrice } from "@/lib/format";
import { PriceBadge } from "./PriceBadge";

export function IdeaCard({ idea }: { idea: IdeaWithSeller }) {
  return (
    <Link
      href={`/ideas/${idea.id}`}
      className="card group flex h-full flex-col gap-3 p-5 transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug group-hover:underline">{idea.title}</h2>
        <PriceBadge price={idea.price} />
      </div>
      <p className="line-clamp-3 flex-1 text-muted">{idea.summary}</p>
      <p className="text-sm text-muted">
        โดย <span className="font-semibold text-ink">{idea.seller.name}</span> · {formatDate(idea.created_at)}
      </p>
      <span className="sr-only">{formatPrice(idea.price)}</span>
    </Link>
  );
}
