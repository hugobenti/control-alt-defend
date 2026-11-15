import { Suspense } from "react";
import { playMetadata } from "@/content/metadata";
import { SandboxScreen } from "@/features/game/components/SandboxScreen/SandboxScreen";

export const metadata = playMetadata;

export default function PlayPage() {
  return (
    <Suspense fallback={null}>
      <SandboxScreen />
    </Suspense>
  );
}
