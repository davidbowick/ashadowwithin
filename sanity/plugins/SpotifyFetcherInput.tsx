// /sanity/plugins/SpotifyFetcherInput.tsx
"use client";

import React, { useState } from "react";
import { set, unset } from "sanity";

export default function SpotifyFetcherInput(props: any) {
  const { value, onChange } = props;
  const [loading, setLoading] = useState(false);

  async function fetchSpotifyData(url: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/fetchSpotify?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Auto-fill Sanity fields
      onChange(set({ _type: "release", ...data }));
    } catch (err) {
      console.error("Spotify fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="url"
        value={value || ""}
        placeholder="Paste Spotify album/track URL"
        onChange={(e) => onChange(e.target.value ? set(e.target.value) : unset())}
        onBlur={(e) => fetchSpotifyData(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />
      {loading && <p>Fetching from Spotify…</p>}
    </div>
  );
}