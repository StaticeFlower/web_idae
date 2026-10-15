import { SITE_NAME, USE_MOCK } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted">
        <p>
          © 2026 · เปลี่ยนไอเดียให้เป็นเงิน
        </p>
        {USE_MOCK && (
          <p className="rounded-full border-2 border-ink bg-spark-soft px-3 py-0.5 font-semibold text-ink">
            โหมดข้อมูลจำลอง (mock)
          </p>
        )}
      </div>
    </footer>
  );
}
