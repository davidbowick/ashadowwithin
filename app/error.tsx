"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Unhandled error (app/error):", error);
  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <h1>Something went wrong</h1>
      <p>{error?.message ?? "An unexpected error occurred."}</p>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => reset()} style={{ marginRight: 8 }}>
          Try again
        </button>
        <Link href="/">Go home</Link>
      </div>
    </div>
  );
}
