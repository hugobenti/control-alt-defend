import Link from "next/link";

import { home } from "@/content/home";
import { button } from "@/features/shared/components/Button/Button.style";
import { cx } from "@/features/shared/utils/cx";

import { homeScreen } from "./HomeScreen.style";

export function HomeScreen() {
  return (
    <main className={homeScreen.base}>
      <h1 className={homeScreen.title}>{home.h1}</h1>
      <p className={homeScreen.lead}>{home.lead}</p>
      <Link
        href={home.playHref}
        className={cx(button.base, button.variant.primary, button.size.md, homeScreen.play)}
      >
        {home.play}
      </Link>
    </main>
  );
}
