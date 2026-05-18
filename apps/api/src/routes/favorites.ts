import { Hono } from "hono";
import type { FavoriteRecord } from "@pokedex/types";
import { bearerAuth, type AuthVariables } from "../middleware/auth.js";

const store: FavoriteRecord[] = [];

export const favoritesRoute = new Hono<{ Variables: AuthVariables }>();

favoritesRoute.post("/favorites", bearerAuth, async (c) => {
  const body = await c.req.json<{ pokemonId: number }>();
  if (typeof body?.pokemonId !== "number") {
    return c.json({ error: "pokemonId required" }, 400);
  }
  const record: FavoriteRecord = {
    userId: c.get("userId"),
    pokemonId: body.pokemonId,
    createdAt: new Date().toISOString(),
  };
  store.push(record);
  return c.json(record, 201);
});

favoritesRoute.get("/favorites/:userId", (c) => {
  const userId = c.req.param("userId");
  return c.json(store.filter((r) => r.userId === userId));
});
