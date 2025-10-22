import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "../../sanity/env";

export const client = createClient({
  projectId,
  dataset,
  useCdn: true, // `false` if you want the freshest data
  apiVersion,
});

export async function getReleases() {
  return client.fetch(`
    *[_type == "release"] | order(releaseDate desc) {
      _id,
      title,
      "slug": slug.current,
      releaseDate,
      "coverImage": coverImage.asset->url,
      // include links.spotify and keep spotifyUrl for compatibility during migration
      links,
      spotifyUrl,
      isrc
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