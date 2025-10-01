// app/api/youtube-subs/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY; // keep this server-side, no NEXT_PUBLIC
    const channelId = "UCf0NfJDnlxehjazWIcBPeJg"; // or keep in .env

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } } // cache for 1 hour
    );

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const data = await res.json();
    const count = data.items?.[0]?.statistics?.subscriberCount ?? null;

    return NextResponse.json({ subCount: count });
  } catch (error) {
    console.error("YouTube API fetch failed:", error);
    return NextResponse.json({ subCount: null }, { status: 500 });
  }
}