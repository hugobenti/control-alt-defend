/**
 * Typed environment variables. next.config.ts imports this file, so `next dev` and `next build` fail
 * on a missing or malformed variable. Read variables from `env`, never from `process.env`.
 * Adding one: declare it here (server-only in `server`, browser-visible `NEXT_PUBLIC_*` in `client`),
 * list it in `runtimeEnv`, `.env.example`, the CI workflow's `env`, and the hosting provider.
 */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    // Production origin, no trailing slash: base for canonical URLs, the sitemap and social images.
    NEXT_PUBLIC_SITE_URL: z.url().refine((url) => !url.endsWith("/"), "no trailing slash"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  emptyStringAsUndefined: true,
  // Tools that load next.config.ts outside Next (knip) don't read .env files; they opt out explicitly.
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
