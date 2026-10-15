import type { ReactNode } from "react";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card flex flex-col items-center gap-3 p-8 text-center">
      <p className="text-lg font-bold">โหลดข้อมูลไม่สำเร็จ</p>
      <p className="text-muted">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          ลองอีกครั้ง
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <p className="text-4xl" aria-hidden>
        🫥
      </p>
      <p className="text-lg font-bold">{title}</p>
      {children && <div className="text-muted">{children}</div>}
    </div>
  );
}

export function IdeaCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-3 p-5" aria-hidden>
      <div className="h-5 w-3/4 rounded bg-ink/10" />
      <div className="h-4 w-full rounded bg-ink/10" />
      <div className="h-4 w-5/6 rounded bg-ink/10" />
      <div className="h-4 w-1/3 rounded bg-ink/10" />
    </div>
  );
}
