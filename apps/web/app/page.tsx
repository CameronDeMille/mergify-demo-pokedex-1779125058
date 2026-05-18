import { loadPokemon } from "./lib/pokemon";
import { FavoriteButton } from "./components/FavoriteButton";

type SearchParams = { page?: string; pageSize?: string };

export default function Page({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const pageRaw = Number(searchParams.page ?? 1);
  const pageSizeRaw = Number(searchParams.pageSize ?? 20);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const pageSize =
    Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
      ? Math.min(100, Math.floor(pageSizeRaw))
      : 20;

  const all = loadPokemon().sort((a, b) => a.id - b.id);
  const start = (page - 1) * pageSize;
  const items = all.slice(start, start + pageSize);
  const hasNext = start + pageSize < all.length;

  const token = process.env.NEXT_PUBLIC_DEMO_TOKEN ?? "demo-user";
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "";

  return (
    <main>
      <h1>Pokedex</h1>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            #{p.id} {p.name} — {p.types.join(", ")}{" "}
            <FavoriteButton pokemonId={p.id} token={token} apiBase={apiBase} />
          </li>
        ))}
      </ul>
      {hasNext && (
        <a href={`/?page=${page + 1}&pageSize=${pageSize}`}>Next page →</a>
      )}
    </main>
  );
}
