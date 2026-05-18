import { describe, it, expect } from "vitest";
import { app } from "../src/app.js";

describe("favorites", () => {
  it("POST /favorites requires bearer auth", async () => {
    const res = await app.request("/favorites", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pokemonId: 25 }),
    });
    expect(res.status).toBe(401);
  });

  it("POST /favorites stores a record and GET returns it", async () => {
    const post = await app.request("/favorites", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer user-ash",
      },
      body: JSON.stringify({ pokemonId: 25 }),
    });
    expect(post.status).toBe(201);
    const record = (await post.json()) as {
      userId: string;
      pokemonId: number;
    };
    expect(record.userId).toBe("user-ash");
    expect(record.pokemonId).toBe(25);

    const get = await app.request("/favorites/user-ash");
    expect(get.status).toBe(200);
    const list = (await get.json()) as Array<{ pokemonId: number }>;
    expect(list.some((r) => r.pokemonId === 25)).toBe(true);
  });
});
