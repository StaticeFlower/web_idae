"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { errorMessage } from "@/lib/format";
import { USE_MOCK } from "@/lib/config";
import { useAuth } from "./AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (isRegister && name.trim().length < 2) return setError("กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("รูปแบบอีเมลไม่ถูกต้อง");
    if (password.length < 8) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");

    setSubmitting(true);
    try {
      if (isRegister) await register({ name, email, password });
      else await login({ email, password });
      router.push("/");
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-extrabold">{isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</h1>

      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
        {isRegister && (
          <div>
            <label htmlFor="name" className="label">
              ชื่อที่แสดง
            </label>
            <input
              id="name"
              className="input"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            className="input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            className="input"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegister && <p className="mt-1 text-xs text-muted">อย่างน้อย 8 ตัวอักษร</p>}
        </div>

        {error && (
          <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-3 py-2 text-danger">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "กรุณารอสักครู่..." : isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </button>

        {USE_MOCK && !isRegister && (
          <p className="rounded-xl bg-spark-soft px-3 py-2 text-sm">
            โหมด mock: ลองใช้ <code className="font-semibold">napat@example.com</code> / รหัสผ่าน{" "}
            <code className="font-semibold">password123</code>
          </p>
        )}
      </form>

      <p className="text-center text-muted">
        {isRegister ? "มีบัญชีอยู่แล้ว? " : "ยังไม่มีบัญชี? "}
        <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-ink underline">
          {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </Link>
      </p>
    </div>
  );
}
