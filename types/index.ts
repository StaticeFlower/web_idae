// Types ตาม ERD (ใช้ snake_case ให้ตรงกับคอลัมน์ในฐานข้อมูล / Supabase)
// หมายเหตุ: password_hash ไม่เคยถูกส่งมาที่ฝั่ง client จึงไม่อยู่ใน type นี้

export type UUID = string;

export interface User {
  id: UUID;
  name: string;
  email: string;
  created_at: string; // ISO datetime
}

/** ข้อมูลผู้ขายที่แสดงให้คนอื่นเห็น (ไม่รวม email) */
export type PublicUser = Pick<User, "id" | "name">;

export interface Idea {
  id: number;
  seller_id: UUID;
  title: string;
  summary: string;
  full_detail: string;
  price: number; // หน่วยบาท, 0 = แชร์ฟรี
  created_at: string; // ISO datetime
}

/** Idea พร้อมข้อมูลผู้ขาย (API ควร join มาให้) */
export interface IdeaWithSeller extends Idea {
  seller: PublicUser;
}

export type IdeaSort = "newest" | "oldest" | "price_asc" | "price_desc";

export interface ListIdeasParams {
  q?: string;
  sort?: IdeaSort;
}

export interface CreateIdeaInput {
  title: string;
  summary: string;
  full_detail: string;
  price: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: User;
}
