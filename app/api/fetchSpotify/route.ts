// /app/api/fetchSpotify/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  try {
    // Extract Spotify ID (album/track)
    const match = url.match(/spotify\.com\/(album|track)\/([a-zA-Z0-9]+)/);
    if (!match) throw new Error("Invalid Spotify URL");
    const [, type, id] = match;

    // Get access token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenRes.json();

    // Fetch Spotify metadata
    const spotifyRes = await fetch(`https://api.spotify.com/v1/${type}s/${id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const data = await spotifyRes.json();

    return NextResponse.json({
      title: data.name,
      releaseDate: data.release_date || null,
      coverImage: data.images?.[0]?.url || null,
      spotifyUrl: url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}