import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ITowerCardProps } from "./TowerCard.type";
import { useTowerCard } from "./useTowerCard";

const base: ITowerCardProps = {
  type: "antivirus",
  version: 2,
  stats: [{ label: "Damage", value: "12", next: "18" }],
  upgrade: { state: "available", cost: 120, nextVersion: 3, adds: "adds piercing" },
  sellRefund: 84,
};

function view(patch: Partial<ITowerCardProps>) {
  return renderHook(() => useTowerCard({ ...base, ...patch })).result.current;
}

describe("tower card view model", () => {
  it("offers the upgrade with its cost when available", () => {
    const result = view({});
    expect(result.canUpgrade).toBe(true);
    expect(result.upgradeDisabled).toBe(false);
    expect(result.upgradeName).toBe("Upgrade to v3.0 · 120");
    expect(result.upgradeShortcut).toBe("U");
  });

  it("disables the upgrade and says how many bits are missing when poor", () => {
    const result = view({
      upgrade: { state: "poor", cost: 120, missingBits: 38, nextVersion: 3, adds: "adds piercing" },
    });
    expect(result.canUpgrade).toBe(true);
    expect(result.upgradeDisabled).toBe(true);
    expect(result.upgradeText).toBe("Need 38 more bits");
    expect(result.upgradeName).toBe("Upgrade to v3.0");
    expect(result.upgradeShortcut).toBeUndefined();
  });

  it("shows no upgrade button and names the locked version when locked", () => {
    const result = view({ upgrade: { state: "locked", nextVersion: 2 } });
    expect(result.canUpgrade).toBe(false);
    expect(result.showMessage).toBe(true);
    expect(result.messageTitle).toBe("v2.0 is locked.");
    expect(result.messageText).toBe("Unlock it in the Upgrade lab between levels.");
    expect(result.messageIcon).toBe("lock");
  });

  it("shows the max message when nothing is left to upgrade", () => {
    const result = view({ version: 3, upgrade: { state: "max" } });
    expect(result.canUpgrade).toBe(false);
    expect(result.messageText).toBe("Max version reached.");
    expect(result.messageTitle).toBeUndefined();
    expect(result.messageIcon).toBe("check");
  });

  it("prefixes next values with an arrow and adds the boost row", () => {
    const result = view({ boost: "+20% damage" });
    expect(result.rows[0]?.next).toBe("→ 18");
    expect(result.boostRow).toEqual({ label: "Firewall boost", value: "+20% damage" });
  });
});
