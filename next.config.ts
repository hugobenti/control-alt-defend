import type { NextConfig } from "next";

// Validates environment variables when the config loads, so `next dev` and `next build` fail on a
// missing or malformed one instead of shipping `undefined`.
import "./src/env";

// Only directives that need no script inventory: framing (clickjacking), <base>, plugins and form
// targets. A `script-src` would need nonces or hashes for Next's inline bootstrap scripts.
const CONTENT_SECURITY_POLICY = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  partialPrefetching: true,
  // Isolated production builds (an agent verifying a change while `next dev` or another build uses
  // .next): `NEXT_DIST_DIR=.next-verify pnpm build && NEXT_DIST_DIR=.next-verify pnpm start`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
