import type {
  AuthSession,
  CreateIdeaInput,
  IdeaWithSeller,
  ListIdeasParams,
  LoginInput,
  RegisterInput,
  Idea,
  User,
} from "@/types";
import { ApiError } from "../http";
import { MOCK_IDEAS, MOCK_USERS, type MockUser } from "./data";

/**
 * ฐานข้อมูลจำลองที่เก็บใน localStorage ของเบราว์เซอร์
 * เพื่อให้ข้อมูลที่สร้างใหม่ (สมัครสมาชิก / เพิ่มไอเดีย) ยังอยู่หลังรีเฟรช
 * ลบทิ้งทั้งหมดได้ด้วย localStorage.removeItem("ideaspark.mockdb.v1")
 */
const DB_KEY = "ideaspark.mockdb.v1";

interface MockDb {
  users: MockUser[];
  ideas: Idea[];
}

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function seed(): MockDb {
  return { users: structuredClone(MOCK_USERS), ideas: structuredClone(MOCK_IDEAS) };
}

function load(): MockDb {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    /* ใช้ seed แทน */
  }
  const db = seed();
  save(db);
  return db;
}

function save(db: MockDb) {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}

function toPublicUser(u: MockUser): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = u;
  return rest;
}

function withSeller(db: MockDb, idea: Idea): IdeaWithSeller {
  const seller = db.users.find((u) => u.id === idea.seller_id);
  return { ...idea, seller: { id: idea.seller_id, name: seller?.name ?? "ผู้ใช้ที่ถูกลบ" } };
}

const tokenFor = (userId: string) => `mock-token-${userId}`;

export const mockIdeas = {
  async list({ q, sort = "newest" }: ListIdeasParams = {}): Promise<IdeaWithSeller[]> {
    await delay();
    const db = load();
    const needle = q?.trim().toLowerCase();
    let items = db.ideas.filter(
      (i) => !needle || i.title.toLowerCase().includes(needle) || i.summary.toLowerCase().includes(needle),
    );
    items = [...items].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });
    return items.map((i) => withSeller(db, i));
  },

  async get(id: number): Promise<IdeaWithSeller> {
    await delay();
    const db = load();
    const idea = db.ideas.find((i) => i.id === id);
    if (!idea) throw new ApiError(404, "ไม่พบไอเดียนี้");
    return withSeller(db, idea);
  },

  async create(input: CreateIdeaInput, token: string | null): Promise<IdeaWithSeller> {
    await delay();
    const db = load();
    const userId = token?.replace("mock-token-", "");
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new ApiError(401, "กรุณาเข้าสู่ระบบก่อน");
    const idea: Idea = {
      id: db.ideas.reduce((max, i) => Math.max(max, i.id), 0) + 1,
      seller_id: user.id,
      ...input,
      created_at: new Date().toISOString(),
    };
    db.ideas.push(idea);
    save(db);
    return withSeller(db, idea);
  },
};

export const mockAuth = {
  async login({ email, password }: LoginInput): Promise<AuthSession> {
    await delay();
    const db = load();
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) throw new ApiError(401, "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    return { token: tokenFor(user.id), user: toPublicUser(user) };
  },

  async register({ name, email, password }: RegisterInput): Promise<AuthSession> {
    await delay();
    const db = load();
    if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new ApiError(409, "อีเมลนี้ถูกใช้งานแล้ว");
    }
    const user: MockUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password,
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    save(db);
    return { token: tokenFor(user.id), user: toPublicUser(user) };
  },

  async me(token: string | null): Promise<User> {
    await delay(150);
    const db = load();
    const user = db.users.find((u) => tokenFor(u.id) === token);
    if (!user) throw new ApiError(401, "เซสชันหมดอายุ");
    return toPublicUser(user);
  },
};
