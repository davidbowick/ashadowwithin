import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const res = await fetch(
    `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_LIST_ID}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KLAVIYO_PRIVATE_API_KEY}`, // ✅ must be Bearer + Private API key
      },
      body: JSON.stringify({ profiles: [{ email }] }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ error }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}