export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatPrice(price: number): string {
  return price > 0 ? `฿${price.toLocaleString("th-TH")}` : "แชร์ฟรี";
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด";
}
