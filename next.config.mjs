/** @type {import('next').NextConfig} */

// When building for GitHub Pages we produce a fully static export served from a
// repo subpath. Normal `dev`/`build` keep middleware + optimized images intact.
const isPages = process.env.GITHUB_PAGES === 'true';
const repo = 'mesa-para-luis';

const nextConfig = {
  reactStrictMode: true,
  ...(isPages
    ? {
        output: 'export',
        basePath: `/${repo}`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: {
          formats: ['image/avif', 'image/webp'],
          remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
          ],
        },
      }),
};

export default nextConfig;
