import { Hono } from "hono";
import { Pokemon } from "@pokedex/types";
import { pokemon, sortPokemon } from "../data/pokemon.js";

export const listRoute = new Hono();

listRoute.get("/pokemon", (c) => {
  const pageRaw = Number(c.req.query("page") ?? 1);
  const pageSizeRaw = Number(c.req.query("pageSize") ?? 20);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const pageSize =
    Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
      ? Math.min(100, Math.floor(pageSizeRaw))
      : 20;

  const sorted: Pokemon[] = sortPokemon(pokemon, "id");
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return c.json({
    items,
    page,
    pageSize,
    total: sorted.length,
    hasNext: start + pageSize < sorted.length,
  });
});
