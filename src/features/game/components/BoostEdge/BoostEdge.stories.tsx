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
export const SharedVerticalEdge: Story = {
  play: async ({ canvasElement }) => {
    const edge = within(canvasElement).getByRole("img", { name: "Firewall boost connection" });
    const filter = canvasElement.querySelector("filter");
    await expect(edge).toHaveAttribute("filter", `url(#${filter?.id})`);
    await expect(filter).toHaveAttribute("filterUnits", "userSpaceOnUse");
    await expect(filter).toHaveAttribute("x", "-100");
    await expect(filter).toHaveAttribute("width", "1200");
  },
};
export const SharedHorizontalEdge: Story = {
  args: { to: { c: 4, r: 3 } },
  render: (args) => (
    <>
      <BoostEdge {...args} />
      <Tower type="antivirus" version={1} c={4} r={3} boosted />
    </>
  ),
  play: async ({ canvasElement }) => {
    const edge = within(canvasElement).getByRole("img", { name: "Firewall boost connection" });
    const filter = canvasElement.querySelector("filter");
    await expect(edge).toHaveAttribute("y1", "120");
    await expect(edge).toHaveAttribute("y2", "120");
    await expect(filter).toHaveAttribute("filterUnits", "userSpaceOnUse");
    await expect(filter).toHaveAttribute("y", "-100");
    await expect(filter).toHaveAttribute("height", "900");
  },
};
export const NoDiagonalBoost: Story = {
  args: { to: { c: 5, r: 3 } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("img", { name: "Firewall boost connection" }),
    ).not.toBeInTheDocument();
  },
};
