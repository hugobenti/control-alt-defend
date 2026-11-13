import { B612, B612_Mono, Chakra_Petch } from "next/font/google";

export const display = Chakra_Petch({
  weight: ["500", "600", "700"],
  variable: "--font-display",
  subsets: ["latin"],
});
export const ui = B612({ weight: ["400", "700"], variable: "--font-ui", subsets: ["latin"] });
export const num = B612_Mono({
  weight: ["400", "700"],
  variable: "--font-num",
  subsets: ["latin"],
});
