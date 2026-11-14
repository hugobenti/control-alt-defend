import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Board } from "../Board/Board";
import { Tower } from "../Tower/Tower";
import { towerStoryMap } from "../Tower/Tower.stories.data";
import { BoostEdge } from "./BoostEdge";

const meta = {
  title: "Game/BoostEdge",
  component: BoostEdge,
  args: { from: { c: 4, r: 2 }, to: { c: 5, r: 2 } },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Story />
        <Tower type="firewall" version={2} c={4} r={2} />
        <Tower type="antivirus" version={1} c={5} r={2} boosted />
      </Board>
    ),
  ],
} satisfies Meta<typeof BoostEdge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SharedVerticalEdge: Story = {};
export const NoDiagonalBoost: Story = {
  args: { to: { c: 5, r: 3 } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("img", { name: "Firewall boost connection" }),
    ).not.toBeInTheDocument();
  },
};
