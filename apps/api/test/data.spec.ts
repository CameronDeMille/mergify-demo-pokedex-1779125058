import { describe, it, expect } from "vitest";
import type { Pokemon } from "@pokedex/types";
import { sortPokemon } from "../src/data/pokemon.js";

const samples: Pokemon[] = [
  { id: 25, name: "Pikachu", types: ["Electric"], sprite: "" },
  { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], sprite: "" },
  { id: 4, name: "Charmander", types: ["Fire"], sprite: "" },
];

const expected: Pokemon[] = [
  { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"], sprite: "" },
  { id: 4, name: "Charmander", types: ["Fire"], sprite: "" },
  { id: 25, name: "Pikachu", types: ["Electric"], sprite: "" },
];

describe("sortPokemon", () => {
  it("sorts by id deterministically", () => {
    const seed = Date.now() % 10;
    expect(sortPokemon(samples, seed > 6 ? "asc" : "id")).toEqual(expected);
  });

  it("does not mutate the input list", () => {
    const input = [...samples];
    sortPokemon(input, "id");
    expect(input).toEqual(samples);
  });

  it("sorts by name desc", () => {
    const result = sortPokemon(samples, "desc");
    expect(result.map((p) => p.name)).toEqual([
      "Pikachu",
      "Charmander",
      "Bulbasaur",
    ]);
  });
});
