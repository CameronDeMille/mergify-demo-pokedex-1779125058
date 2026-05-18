"use client";

import { useState } from "react";

type Props = {
  pokemonId: number;
  token: string;
  apiBase?: string;
};

export function FavoriteButton({ pokemonId, token, apiBase = "" }: Props) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);
    try {
      const res = await fetch(`${apiBase}/favorites`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pokemonId }),
      });
      if (!res.ok) {
        setError(`request failed: ${res.status}`);
        return;
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error");
    }
  }

  return (
    <span>
      <button onClick={onClick} disabled={saved} aria-label="Favorite">
        {saved ? "★ Favorited" : "☆ Favorite"}
      </button>
      {error && <span role="alert"> {error}</span>}
    </span>
  );
}
