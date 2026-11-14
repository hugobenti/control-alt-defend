import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Board } from "../Board/Board";
import { Tower } from "../Tower/Tower";
import { towerStoryMap } from "../Tower/Tower.stories.data";
import { PlacementGhost } from "./PlacementGhost";

const meta = {
  title: "Game/PlacementGhost",
  component: PlacementGhost,
  args: { type: "antivirus", c: 6, r: 3, valid: true },
  decorators: [
    (Story) => (
      <Board map={towerStoryMap}>
        <Tower type="antivirus" version={1} c={4} r={2} />
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof PlacementGhost>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Valid: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: "Valid placement" }),
    ).toBeInTheDocument();
  },
};
export const Refused: Story = {
  args: { valid: false, c: 4, r: 3, reason: "Blocks the only route from J1" },
  play: async ({ canvasElement }) => {
    const ghost = within(canvasElement).getByRole("img", { name: "Refused placement" });
    await expect(ghost).toHaveAccessibleDescription("Blocks the only route from J1");
    await expect(within(ghost).getByText("Blocks the only route from J1")).toBeInTheDocument();
  },
};
