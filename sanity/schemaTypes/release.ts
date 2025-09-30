// /sanity/schemaTypes/release.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
    }),
    defineField({
      name: "spotifyUrl",
      title: "Spotify URL",
      type: "url",
    }),
    defineField({
      name: "links",
      title: "Other Links",
      type: "object",
      fields: [
        { name: "appleMusic", title: "Apple Music", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
        { name: "bandcamp", title: "Bandcamp", type: "url" },
      ],
    }),
  ],
});