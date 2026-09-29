import Organization from '../models/Organization.js';

/**
 * Convert a string into a URL-friendly slug.
 * "Acme Inc." → "acme-inc"
 */
export function toSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')           // spaces → dashes
    .replace(/-+/g, '-')            // collapse dashes
    .replace(/^-|-$/g, '');         // trim leading/trailing dashes
}

/**
 * Generate a UNIQUE slug by appending -2, -3, ... if needed.
 * "acme-inc" exists → "acme-inc-2" → "acme-inc-3" ...
 */
export async function generateUniqueSlug(name) {
  const base = toSlug(name) || 'org';
  let slug = base;
  let counter = 1;

  // Loop until we find a free slug
  while (await Organization.exists({ slug })) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
}