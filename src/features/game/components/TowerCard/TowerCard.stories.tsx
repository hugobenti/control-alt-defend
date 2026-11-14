import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { game } from "@/content/game";

import { TowerCard } from "./TowerCard";
import type { ITowerCardStat } from "./TowerCard.type";

const antivirusStats: ITowerCardStat[] = [
  { label: "Damage", value: "12", next: "18" },
  { label: "Fire rate", value: "1.2 /s" },
  { label: "Range", value: "3.0", next: "3.5" },
  { label: game.card.boost, value: "+20% damage", tone: "boost" },
  { label: "Targets", value: "Carriers first" },
  { label: "Kills", value: "23" },
];
const piercing = "adds piercing: each shot also hits the virus behind.";

const meta = {
  title: "Game/TowerCard",
  component: TowerCard,
  args: {
    type: "antivirus",
    version: 2,
    stats: antivirusStats,
    upgrade: { state: "available", cost: 120, nextVersion: 3, adds: piercing },
    sellRefund: 84,
    onUpgrade: fn(),
    onSell: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TowerCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const UpgradeAvailable: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Antivirus" })).toBeInTheDocument();
    await expect(canvas.getByText("Firewall boost")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /Upgrade to v3\.0 · 120/ }));
    await expect(args.onUpgrade).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: /Sell/ }));
    await expect(args.onSell).toHaveBeenCalledTimes(1);
  },
};

export const NotEnoughBits: Story = {
  args: {
    upgrade: { state: "poor", cost: 120, missingBits: 38, nextVersion: 3, adds: piercing },
  },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Need 38 more bits" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAccessibleDescription("Need 38 more bits");
    await expect(args.onUpgrade).not.toHaveBeenCalled();
  },
};

export const LockedInLab: Story = {
  args: {
    type: "debugger",
    version: 1,
    stats: [
      { label: "Damage", value: "4 → ramps to 30 /s" },
      { label: "Range", value: "2.5" },
      { label: "Ramp time", value: "3 s" },
      { label: "Targets", value: "Carriers first" },
      { label: "Kills", value: "6" },
    ],
    upgrade: { state: "locked", nextVersion: 2 },
    sellRefund: 63,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: /Upgrade/ })).toBeNull();
    await expect(
      canvas.getByText("Unlock it in the Upgrade lab between levels.", { exact: false }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("v2.0 is locked.")).toBeInTheDocument();
  },
};

export const MaxVersion: Story = {
  args: {
    type: "debugger",
    version: 3,
    stats: [
      { label: "Damage", value: "8 → ramps to 60 /s" },
      { label: "Range", value: "3.0" },
      { label: "Ramp time", value: "2 s" },
      { label: "Chains to", value: "1 more virus" },
      { label: "Kills", value: "41" },
    ],
    upgrade: { state: "max" },
    sellRefund: 238,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Max version reached.")).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: /Upgrade/ })).toBeNull();
  },
};

export const Firewall: Story = {
  args: {
    type: "firewall",
    version: 2,
    stats: [
      { label: "Blocks", value: "1 cell" },
      { label: game.card.boostOwn, value: "+20% damage", tone: "boost" },
      { label: game.card.boostingLabel, value: game.card.boosting(3) },
    ],
    upgrade: {
      state: "available",
      cost: 60,
      nextVersion: 3,
      adds: "raises the boost to +40% damage and adds +0.5 range.",
    },
    sellRefund: 21,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Firewall" })).toBeInTheDocument();
    await expect(canvas.getByText(game.card.boostingLabel)).toBeInTheDocument();
    await expect(canvas.getByText(game.card.boostOwn)).toBeInTheDocument();
    await expect(canvas.getByText(game.card.boosting(3))).toBeInTheDocument();
    await expect(canvas.getByText("+20% damage")).toBeInTheDocument();
  },
};
