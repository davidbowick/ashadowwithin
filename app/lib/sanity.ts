import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // set in .env
  dataset: "production",
  useCdn: true, // `false` if you want the freshest data
  apiVersion: "2025-01-01", // today's date or latest
});