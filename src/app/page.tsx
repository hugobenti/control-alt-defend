import { homeMetadata } from "@/content/metadata";
import { HomeScreen } from "@/features/home/components/HomeScreen";

export const metadata = homeMetadata;

export default function HomePage() {
  return <HomeScreen />;
}
