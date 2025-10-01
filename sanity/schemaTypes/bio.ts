import { defineType, defineField } from "sanity";

export default defineType({
  name: "bio",
  title: "Bio",
  type: "document",
  fields: [
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      description: "A short version of the band bio for social media, metadata, or condensed use.",
      rows: 3,
    }),
    defineField({
      name: "longBio",
      title: "Long Bio",
      type: "array",
      description: "The full bio with more details. Supports rich text.",
      of: [{ type: "block" }],
    }),
  ],
});