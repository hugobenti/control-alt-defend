import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Beam } from "../Beam/Beam";
import { Board } from "../Board/Board";
import { Tower } from "../Tower/Tower";
import { towerStoryMap } from "../Tower/Tower.stories.data";
import { Enemy } from "./Enemy";
import type { TEnemyType } from "./Enemy.type";

const armoredType: TEnemyType = "rootkit";

const meta = {
  title: "Game/Enemy",
  component: Enemy,
  args: { type: "worm", x: 240, y: 120, heading: 0, health: 1 },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof Enemy>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Worm: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Worm, 100% health" }),
    ).toBeInTheDocument();
  },
};
export const WormSplitPair: Story = {
  args: { small: true, health: 0.5 },
  render: (args) => (
    <>
      <Enemy {...args} x={224} y={116} heading={-12} />
      <Enemy {...args} x={256} y={124} heading={10} />
    </>
  ),
};
export const WormHit: Story = {
  args: { health: 0.35, hit: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Worm, 35% health" }),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector("[data-hit]")).not.toBeNull();
  },
};
export const WormCarrier: Story = {
  args: { health: 0.7, carrier: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Worm, 70% health, carrying a file" }),
    ).toBeInTheDocument();
  },
};
export const Rootkit: Story = { args: { type: "rootkit" } };
export const RootkitUnderDebuggerBeam: Story = {
  args: { type: "rootkit", x: 230, y: 100, health: 0.45 },
  render: (args) => (
    <>
      <Tower type="debugger" version={2} c={2} r={2} />
      <Beam from={{ x: 100, y: 100 }} to={{ x: 218, y: 100 }} ramp={0.9} />
      <Enemy {...args} />
    </>
  ),
};
export const RootkitCarrier: Story = {
  args: { type: "rootkit", health: 0.8, carrier: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", {
        name: "Rootkit, 80% health, armored, carrying a file",
      }),
    ).toBeInTheDocument();
  },
};
export const HealthBars: Story = {
  render: (args) => (
    <>
      <Enemy {...args} x={80} health={1} />
      <Enemy {...args} x={160} health={0.7} />
      <Enemy {...args} x={240} health={0.35} />
      <Enemy {...args} x={320} health={0.1} />
      <Enemy {...args} type={armoredType} x={400} health={0.5} />
    </>
  ),
};
