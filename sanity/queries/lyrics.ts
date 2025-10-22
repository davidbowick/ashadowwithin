// /sanity/queries/lyrics.ts
import { groq } from "next-sanity";

export const allLyricsQuery = groq`
  // Fetch all releases and let the application filter out those without usable lyrics.
  // This is more robust against mixed storage formats (string vs portable text array)
  // which can sometimes make server-side defined() checks miss documents.
  *[_type == "release"]{
    _id, title, "slug": slug.current, releaseDate, coverImage, lyrics, isrc,
  "youtube": coalesce(youtubeVideo, null)
  } | order(releaseDate desc, title asc)
`;

export const lyricsBySlugQuery = groq`
  *[_type == "release" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, releaseDate, coverImage,
  lyrics, links, youtubeVideo, isInstrumental, credits, isrc
  }
`;