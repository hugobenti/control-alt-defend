import { home } from "@/content/home";

import { homeScreen } from "./HomeScreen.style";

export function HomeScreen() {
  return (
    <main className={homeScreen.base}>
      <h1 className={homeScreen.title}>{home.h1}</h1>
      <p className={homeScreen.lead}>{home.lead}</p>
    </main>
  );
}
