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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "")
            .slice(0, 200),
      },
      description: "Unique URL-friendly identifier (auto-generated from title)",
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
    // spotifyUrl moved into the links object as links.spotify
    defineField({
      name: "isrc",
      title: "ISRC",
      type: "string",
      description: "International Standard Recording Code (e.g. US-S1Z-99-00001)",
    }),
    defineField({
      name: "lyrics",
      title: "Lyrics",
      type: "text",
      description: "Plain-text or pasted lyrics. Use plain text formatting; blocks are not required.",
    }),
    defineField({
      name: "isInstrumental",
      title: "Instrumental",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "text",
      description: "Optional credits (writers, composers, etc.)",
    }),
    defineField({
      name: "youtubeVideo",
      title: "YouTube Video",
      type: "url",
      description: "A single YouTube video URL (e.g. https://youtu.be/...). If you previously used multiple videos, please pick the canonical one.",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "object",
      fields: [
        { name: "spotify", title: "Spotify", type: "url" },
        { name: "appleMusic", title: "Apple Music", type: "url" },
        { name: "youtube", title: "YouTube Music", type: "url" },
        { name: "bandcamp", title: "Bandcamp", type: "url" },
        { name: "amazonMusic", title: "Amazon Music", type: "url" },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'isrc'
    }
  }
});