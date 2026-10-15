"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/config";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-spark text-base"
          >
            💡
          </span>
          {SITE_NAME}
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/ideas/new" className="btn btn-primary">
            + แชร์ไอเดีย
          </Link>
          {loading ? (
            <span className="h-9 w-20 animate-pulse rounded-xl bg-ink/10" aria-hidden />
          ) : user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline" title={user.email}>
                {user.name}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-ghost">
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
