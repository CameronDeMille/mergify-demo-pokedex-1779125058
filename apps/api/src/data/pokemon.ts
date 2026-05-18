import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { Pokemon } from "@pokedex/types";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(here, "../../../../data/pokemon.json");

export const pokemon: Pokemon[] = JSON.parse(readFileSync(dataPath, "utf8"));

export type SortMode = "id" | "asc" | "desc";

export function sortPokemon(list: Pokemon[], mode: SortMode): Pokemon[] {
  const copy = [...list];
  switch (mode) {
    case "id":
      return copy.sort((a, b) => a.id - b.id);
    case "asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
  }
}
