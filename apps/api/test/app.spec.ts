import { describe, it, expect } from "vitest";
import { app } from "../src/app.js";

describe("api", () => {
  it("GET /health returns ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("GET /pokemon returns a paginated page", async () => {
    const res = await app.request("/pokemon?page=1&pageSize=3");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      items: unknown[];
      page: number;
      pageSize: number;
      total: number;
      hasNext: boolean;
    };
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(3);
    expect(body.items.length).toBe(3);
    expect(body.total).toBeGreaterThan(0);
    expect(body.hasNext).toBe(true);
  });

  it("GET /pokemon defaults page and pageSize", async () => {
    const res = await app.request("/pokemon");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { page: number; pageSize: number };
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });
});
