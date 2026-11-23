import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { homePc } from "../../level/homePc.data";
import { Board } from "../Board/Board";
import { BoardCursor } from "./BoardCursor";

const meta = {
  title: "Game/BoardCursor",
  component: BoardCursor,
  args: { c: 7, r: 6 },
  decorators: [
    (Story) => (
      <Board map={homePc}>
        <Story />
      </Board>
    ),
  ],
} satisfies Meta<typeof BoardCursor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AtCellSevenSix: Story = {
  play: async ({ canvasElement }) => {
    const cursor = within(canvasElement).getByRole("img", { name: "Cell 7, 6" });
    await expect(cursor).toBeInTheDocument();
    await expect(cursor.querySelector("rect")).toHaveAttribute("x", "281");
    await expect(cursor.querySelector("rect")).toHaveAttribute("y", "241");
  },
};

export const KeyboardOnCore: Story = {
  args: { c: 11, r: 7 },
  play: async ({ canvasElement }) => {
    const cursor = within(canvasElement).getByRole("img", { name: "Cell 11, 7" });
    await expect(cursor).toBeInTheDocument();
    await expect(cursor.querySelector("rect")).toHaveAttribute("x", "441");
    await expect(cursor.querySelector("rect")).toHaveAttribute("y", "281");
  },
};
