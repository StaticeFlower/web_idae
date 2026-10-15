import type { AuthSession, LoginInput, RegisterInput, User } from "@/types";
import { USE_MOCK } from "../config";
import { getToken } from "../auth-storage";
import { http } from "../http";
import { mockAuth } from "../mock/db";

/**
 * Endpoint ที่คาดหวังจาก API จริง:
 *   POST /auth/login     { email, password }        -> { token, user }
 *   POST /auth/register  { name, email, password }  -> { token, user }
 *   GET  /auth/me        (Bearer token)             -> User
 */
export const authApi = {
  login(input: LoginInput): Promise<AuthSession> {
    if (USE_MOCK) return mockAuth.login(input);
    return http<AuthSession>("/auth/login", { method: "POST", body: input });
  },

  register(input: RegisterInput): Promise<AuthSession> {
    if (USE_MOCK) return mockAuth.register(input);
    return http<AuthSession>("/auth/register", { method: "POST", body: input });
  },

  me(): Promise<User> {
    if (USE_MOCK) return mockAuth.me(getToken());
    return http<User>("/auth/me");
  },
};
