import "./globals.css";

import { siteMetadata } from "@/content/metadata";
import { site } from "@/content/site";
import { cx } from "@/features/shared/utils/cx";

import { display, num, ui } from "./fonts";
import { layout } from "./layout.style";
import { siteViewport } from "./viewport";

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={cx(display.variable, ui.variable, num.variable, layout.html)}>
      <body className={layout.body}>{children}</body>
    </html>
  );
}
