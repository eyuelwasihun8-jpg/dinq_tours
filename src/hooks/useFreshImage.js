/**
 * Helper to add cache-busting query parameter to image URLs
 * so updated images show immediately after upload
 */
export function freshImage(url) {
  if (!url) return '';
  // If URL already has cache-buster, use as-is
  if (url.includes('?v=')) return url;
  // Add timestamp to force browser to fetch fresh
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}