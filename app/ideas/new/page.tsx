"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ideasApi } from "@/lib/api/ideas";
import { errorMessage } from "@/lib/format";
import { useAuth } from "@/components/AuthProvider";

interface FormState {
  title: string;
  summary: string;
  full_detail: string;
  price: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const LIMITS = { title: 120, summary: 300 };

function validate(f: FormState): FieldErrors {
  const e: FieldErrors = {};
  if (f.title.trim().length < 5) e.title = "ชื่อไอเดียต้องมีอย่างน้อย 5 ตัวอักษร";
  if (f.title.length > LIMITS.title) e.title = `ชื่อไอเดียยาวได้ไม่เกิน ${LIMITS.title} ตัวอักษร`;
  if (f.summary.trim().length < 10) e.summary = "สรุปสั้น ๆ ต้องมีอย่างน้อย 10 ตัวอักษร";
  if (f.summary.length > LIMITS.summary) e.summary = `สรุปยาวได้ไม่เกิน ${LIMITS.summary} ตัวอักษร`;
  if (f.full_detail.trim().length < 30) e.full_detail = "รายละเอียดเต็มต้องมีอย่างน้อย 30 ตัวอักษร";
  const price = Number(f.price);
  if (f.price === "" || !Number.isInteger(price) || price < 0) e.price = "ราคาต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
  return e;
}

export default function NewIdeaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ title: "", summary: "", full_detail: "", price: "0" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const idea = await ideasApi.create({
        title: form.title.trim(),
        summary: form.summary.trim(),
        full_detail: form.full_detail.trim(),
        price: Number(form.price),
      });
      router.push(`/ideas/${idea.id}`);
    } catch (err) {
      setSubmitError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return <div className="card h-64 animate-pulse" aria-hidden />;
  }

  if (!user) {
    return (
      <div className="card mx-auto max-w-lg space-y-4 p-8 text-center">
        <p className="text-4xl" aria-hidden>
          🔐
        </p>
        <h1 className="text-2xl font-extrabold">เข้าสู่ระบบก่อนแชร์ไอเดีย</h1>
        <p className="text-muted">คุณต้องมีบัญชีเพื่อให้เรารู้ว่าไอเดียนี้เป็นของใคร</p>
        <div className="flex justify-center gap-3">
          <Link href="/login" className="btn btn-primary">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="btn btn-ghost">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">แชร์ไอเดียของคุณ</h1>
        <p className="mt-1 text-muted">เล่าให้ชัด สั้น และน่าสนใจ เพื่อให้คนอยากอ่านต่อ</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
        <div>
          <label htmlFor="title" className="label">
            ชื่อไอเดีย
          </label>
          <input
            id="title"
            className="input"
            value={form.title}
            onChange={set("title")}
            maxLength={LIMITS.title}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            placeholder="เช่น แอปแบ่งบิลกลุ่มเพื่อนผ่าน LINE"
          />
          {errors.title && <FieldError id="title-error">{errors.title}</FieldError>}
        </div>

        <div>
          <label htmlFor="summary" className="label">
            สรุปสั้น ๆ
          </label>
          <textarea
            id="summary"
            rows={3}
            className="input"
            value={form.summary}
            onChange={set("summary")}
            maxLength={LIMITS.summary}
            aria-invalid={!!errors.summary}
            aria-describedby={errors.summary ? "summary-error" : "summary-count"}
            placeholder="อธิบายไอเดียใน 1-2 ประโยค (แสดงบนการ์ด)"
          />
          <div className="mt-1 flex justify-between gap-2">
            {errors.summary ? <FieldError id="summary-error">{errors.summary}</FieldError> : <span />}
            <span id="summary-count" className="text-xs text-muted">
              {form.summary.length}/{LIMITS.summary}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="full_detail" className="label">
            รายละเอียดเต็ม
          </label>
          <textarea
            id="full_detail"
            rows={10}
            className="input"
            value={form.full_detail}
            onChange={set("full_detail")}
            aria-invalid={!!errors.full_detail}
            aria-describedby={errors.full_detail ? "detail-error" : undefined}
            placeholder="ปัญหาที่แก้ แนวทาง โมเดลรายได้ ขั้นตอนต่อไป..."
          />
          {errors.full_detail && <FieldError id="detail-error">{errors.full_detail}</FieldError>}
        </div>

        <div>
          <label htmlFor="price" className="label">
            ราคา (บาท)
          </label>
          <input
            id="price"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            className="input max-w-48"
            value={form.price}
            onChange={set("price")}
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : "price-hint"}
          />
          {errors.price ? (
            <FieldError id="price-error">{errors.price}</FieldError>
          ) : (
            <p id="price-hint" className="mt-1 text-xs text-muted">
              ใส่ 0 หากต้องการแชร์ฟรี (ระบบซื้อขายจะเปิดให้ใช้งานในอนาคต)
            </p>
          )}
        </div>

        {submitError && (
          <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-3 py-2 text-danger">
            {submitError}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/" className="btn btn-ghost">
            ยกเลิก
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "กำลังบันทึก..." : "เผยแพร่ไอเดีย"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1 text-sm font-medium text-danger">
      {children}
    </p>
  );
}
