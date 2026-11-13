import "./globals.css";

import { siteMetadata } from "@/content/metadata";
import { site } from "@/content/site";
import { cx } from "@/features/shared/utils/cx";

import { mono, sans } from "./fonts";
import { layout } from "./layout.style";
import { siteViewport } from "./viewport";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={cx(sans.variable, mono.variable, layout.html)}>
      <body className={layout.body}>{children}</body>
    </html>
  );
}
