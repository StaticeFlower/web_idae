export const SITE_NAME = "IdeaSpark";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * ใช้ mock data เป็นค่าเริ่มต้น
 * เมื่อมี API จริงแล้ว ตั้ง NEXT_PUBLIC_USE_MOCK=false ใน .env.local
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
