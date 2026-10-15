import type { CreateIdeaInput, IdeaWithSeller, ListIdeasParams } from "@/types";
import { USE_MOCK } from "../config";
import { getToken } from "../auth-storage";
import { http } from "../http";
import { mockIdeas } from "../mock/db";

/**
 * Endpoint ที่คาดหวังจาก API จริง (ปรับได้ที่ไฟล์นี้ไฟล์เดียว):
 *   GET  /ideas?q=&sort=   -> IdeaWithSeller[]
 *   GET  /ideas/:id        -> IdeaWithSeller
 *   POST /ideas            -> IdeaWithSeller   (ต้องแนบ Bearer token)
 */
export const ideasApi = {
  list(params: ListIdeasParams = {}): Promise<IdeaWithSeller[]> {
    if (USE_MOCK) return mockIdeas.list(params);
    return http<IdeaWithSeller[]>("/ideas", { query: { q: params.q, sort: params.sort } });
  },

  get(id: number): Promise<IdeaWithSeller> {
    if (USE_MOCK) return mockIdeas.get(id);
    return http<IdeaWithSeller>(`/ideas/${id}`);
  },

  create(input: CreateIdeaInput): Promise<IdeaWithSeller> {
    if (USE_MOCK) return mockIdeas.create(input, getToken());
    return http<IdeaWithSeller>("/ideas", { method: "POST", body: input });
  },
};
