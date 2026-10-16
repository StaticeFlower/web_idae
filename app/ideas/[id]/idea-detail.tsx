"use client";

import Link from "next/link";
import { ideasApi } from "@/lib/api/ideas";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";
import { PriceBadge } from "@/components/PriceBadge";
import { ErrorState } from "@/components/States";

export default function IdeaDetail({ id }: { id: number }) {
  const { data: idea, error, loading, reload } = useAsync(
    () => (Number.isInteger(id) ? ideasApi.get(id) : Promise.reject(new Error("ไม่พบไอเดียนี้"))),
    [id],
  );

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-block text-sm font-semibold underline">
        ← กลับไปหน้ารวมไอเดีย
      </Link>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading || !idea ? (
        <div className="card animate-pulse space-y-4 p-8" aria-hidden>
          <div className="h-8 w-2/3 rounded bg-ink/10" />
          <div className="h-4 w-1/3 rounded bg-ink/10" />
          <div className="h-24 w-full rounded bg-ink/10" />
          <div className="h-40 w-full rounded bg-ink/10" />
        </div>
      ) : (
        <article className="space-y-6">
          <header className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{idea.title}</h1>
              <PriceBadge price={idea.price} />
            </div>
            <p className="text-muted">
              โดย <span className="font-semibold text-ink">{idea.seller.name}</span> ·{" "}
              <time dateTime={idea.created_at}>{formatDate(idea.created_at)}</time>
            </p>
          </header>

          <section className="card bg-spark-soft p-5" aria-label="สรุปไอเดีย">
            <p className="text-lg font-medium">{idea.summary}</p>
          </section>

          <section className="card p-6 sm:p-8" aria-labelledby="detail-heading">
            <h2 id="detail-heading" className="mb-3 text-xl font-extrabold">
              รายละเอียดเต็ม
            </h2>
            <div className="whitespace-pre-wrap text-lg leading-relaxed">{idea.full_detail}</div>
          </section>
        </article>
      )}
    </div>
  );
}