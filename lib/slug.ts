/** Turn a title into a URL-safe slug (accents stripped). */
export function slugify(input: string): string {
  const withoutAccents = input
    .normalize('NFD')
    .split('')
    // drop combining diacritical marks (U+0300–U+036F)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f;
    })
    .join('');

  return withoutAccents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
