import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { homePc } from "../../level/homePc.data";
import { Board } from "../Board/Board";
import { RoutePreview } from "./RoutePreview";

const meta = {
  title: "Game/RoutePreview",
  component: RoutePreview,
  args: {
    routes: [
      [
        { x: 20, y: 100 },
        { x: 220, y: 100 },
        { x: 460, y: 300 },
      ],
      [
        { x: 940, y: 500 },
        { x: 740, y: 500 },
        { x: 500, y: 340 },
      ],
    ],
  },
  decorators: [
    (Story) => (
      <Board map={homePc}>
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof RoutePreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TwoRoutes: Story = {
  play: async ({ canvasElement }) => {
    const lines = within(canvasElement)
      .getByRole("group", { name: "Home PC board" })
      .querySelectorAll("polyline");
    await expect(lines).toHaveLength(2);
    await expect(lines[0]).toHaveAttribute("points", "20,100 220,100 460,300");
    await expect(lines[1]).toHaveAttribute("points", "940,500 740,500 500,340");
    await expect(lines[0]).toHaveAttribute("aria-hidden", "true");
  },
};

export const Empty: Story = {
  args: { routes: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("polyline")).not.toBeInTheDocument();
  },
};
