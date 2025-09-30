// /lib/sanity.image.ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./sanity";  // ✅ point to sanity.ts

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}