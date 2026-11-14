import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Board } from "../Board/Board";
import { BoostEdge } from "../BoostEdge/BoostEdge";
import { RangeRing } from "../RangeRing/RangeRing";
import { Tower } from "./Tower";
import { towerStoryMap } from "./Tower.stories.data";
import type { TVersion } from "./Tower.type";

const boostingVersion: TVersion = 2;

const meta = {
  title: "Game/Tower",
  component: Tower,
  args: { type: "antivirus", version: 1, c: 4, r: 2 },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof Tower>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FirewallV1: Story = { args: { type: "firewall", version: 1 } };
export const FirewallV2: Story = { args: { type: "firewall", version: boostingVersion } };
export const FirewallV3: Story = { args: { type: "firewall", version: 3 } };
export const AntivirusV1: Story = {};
export const AntivirusV2: Story = { args: { version: 2 } };
export const AntivirusV3: Story = { args: { version: 3 } };
export const DebuggerV1: Story = { args: { type: "debugger", version: 1 } };
export const DebuggerV2: Story = { args: { type: "debugger", version: 2 } };
export const DebuggerV3: Story = { args: { type: "debugger", version: 3 } };
export const SelectedWithRange: Story = {
  args: { version: 2, selected: true },
  render: (args) => (
    <>
      <RangeRing type="antivirus" c={4} r={2} range={3} />
      <Tower {...args} />
    </>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Antivirus v2.0, selected" }),
    ).toBeInTheDocument();
  },
};
export const FirewallV2Boosting: Story = {
  args: { type: "firewall", version: 2 },
  render: (args) => (
    <>
      <BoostEdge from={{ c: 4, r: 2 }} to={{ c: 5, r: 2 }} />
      <Tower {...args} />
      <Tower type="antivirus" version={1} c={5} r={2} boosted />
    </>
  ),
};
export const FirewallV3Boosting: Story = {
  args: { type: "firewall", version: 3 },
  render: (args) => (
    <>
      <BoostEdge from={{ c: 4, r: 2 }} to={{ c: 5, r: 2 }} />
      <Tower {...args} />
      <Tower type="debugger" version={2} c={5} r={2} boosted />
    </>
  ),
};
export const BoostedDebugger: Story = { args: { type: "debugger", version: 2, boosted: true } };
