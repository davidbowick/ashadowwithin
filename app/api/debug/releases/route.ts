import { NextResponse } from "next/server";
import { getReleases } from "../../../lib/sanity";

export async function GET() {
  try {
    const releases = await getReleases();
    return NextResponse.json({ count: releases.length, releases });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
