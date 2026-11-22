/** @type {import('next').NextConfig} */
const nextConfig = {
  // A new Next 16 project arrives with cacheComponents and partialPrefetching
  // switched on. Neither was our choice and neither helps three pages that
  // must show live numbers on every load. cacheComponents also refuses
  // "export const dynamic", which is how our pages say "always read the
  // database", so both are off.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
