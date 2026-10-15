"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IdeaSort } from "@/types";
import { ideasApi } from "@/lib/api/ideas";
import { useAsync } from "@/hooks/useAsync";
import { IdeaCard } from "@/components/IdeaCard";
import { EmptyState, ErrorState, IdeaCardSkeleton } from "@/components/States";

const SORT_OPTIONS: { value: IdeaSort; label: string }[] = [
  { value: "newest", label: "ใหม่ล่าสุด" },
  { value: "oldest", label: "เก่าสุด" },
  { value: "price_asc", label: "ราคาต่ำ → สูง" },
  { value: "price_desc", label: "ราคาสูง → ต่ำ" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<IdeaSort>("newest");

  // debounce ช่องค้นหา เพื่อไม่ยิง API ทุกตัวอักษร
  useEffect(() => {
    const t = setTimeout(() => setQ(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: ideas, error, loading, reload } = useAsync(() => ideasApi.list({ q, sort }), [q, sort]);

  return (
    <div className="space-y-8">
      <section className="card bg-spark-soft p-6 sm:p-10">
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
          ไอเดียดี ๆ ไม่ควรอยู่แค่ในหัว
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          แชร์ไอเดียของคุณ ให้คนอื่นเห็น ต่อยอด และเปลี่ยนมันให้เป็นเงินได้ในอนาคต
        </p>
        <Link href="/ideas/new" className="btn btn-primary mt-6 px-6! py-3! text-base">
          เริ่มแชร์ไอเดียแรกของคุณ
        </Link>
      </section>

      <section className="space-y-4" aria-labelledby="ideas-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="ideas-heading" className="text-2xl font-extrabold">
            ไอเดียทั้งหมด
          </h2>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="min-w-0 flex-1 sm:w-64 sm:flex-none">
              <label htmlFor="search" className="sr-only">
                ค้นหาไอเดีย
              </label>
              <input
                id="search"
                type="search"
                className="input"
                placeholder="ค้นหาไอเดีย..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sort" className="sr-only">
                เรียงตาม
              </label>
              <select
                id="sort"
                className="input"
                value={sort}
                onChange={(e) => setSort(e.target.value as IdeaSort)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !ideas ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <IdeaCardSkeleton key={i} />
            ))}
          </div>
        ) : ideas && ideas.length === 0 ? (
          <EmptyState title={q ? `ไม่พบไอเดียที่ตรงกับ "${q}"` : "ยังไม่มีไอเดียในตอนนี้"}>
            <Link href="/ideas/new" className="font-semibold underline">
              มาเป็นคนแรกที่แชร์ไอเดีย
            </Link>
          </EmptyState>
        ) : (
          <div
            className={`grid gap-5 transition-opacity sm:grid-cols-2 ${loading ? "opacity-60" : ""}`}
            aria-busy={loading}
          >
            {ideas?.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}
          </div>
        )}
      </section>
    </div>
  );
}
