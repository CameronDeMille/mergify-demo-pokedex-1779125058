import type { MiddlewareHandler } from "hono";

export type AuthVariables = { userId: string };

export const bearerAuth: MiddlewareHandler<{
  Variables: AuthVariables;
}> = async (c, next) => {
  const header = c.req.header("authorization") ?? "";
  const match = header.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return c.json({ error: "unauthorized" }, 401);
  }
  c.set("userId", match[1]);
  await next();
};
