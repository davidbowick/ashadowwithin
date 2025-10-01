import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // set in .env
  dataset: "production",
  useCdn: true, // `false` if you want the freshest data
  apiVersion: "2025-01-01", // today's date or latest
});

export async function getReleases() {
  return client.fetch(`
    *[_type == "release"] | order(releaseDate desc) {
      _id,
      title,
      releaseDate,
      "coverImage": coverImage.asset->url,
      spotifyUrl,
      links
    }
  `);
}

export async function getBio() {
  return client.fetch(`
    *[_type == "bio"][0]{
      shortBio,
      longBio
    }
  `);
}