/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/utils/slugify.ts
export function slugify(text: string): string {
  if (!text) return "";
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Replace spaces with -
    .replace(/[^\w\-]+/g, "")    // Remove all non-word chars
    .replace(/\-\-+/g, "-")      // Replace multiple - with single -
    .replace(/^-+/, "")          // Trim - from start of text
    .replace(/-+$/, "");         // Trim - from end of text
}

export function generateBillboardSlug(billboard: any): string {
  const mediaType = slugify(billboard.mediaType || "billboard");
  const city = slugify(billboard.city || billboard.locationAddress || "location");
  const id = billboard._id;
  
  return `/billboard/${mediaType}/${city}/${id}`;
}