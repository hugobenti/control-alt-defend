import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { homePc } from "../../level/homePc.data";
import { Board } from "./Board";

const meta = { title: "Game/Board", component: Board, args: { map: homePc } } satisfies Meta<
  typeof Board
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HomePc: Story = {
  play: async ({ canvasElement }) => {
    const board = within(canvasElement).getByRole("group", { name: "Home PC board" });
    await expect(board).toHaveAttribute("viewBox", "-16 -16 992 672");
    await expect(board).not.toHaveAttribute("width");
    await expect(board).not.toHaveAttribute("height");
    await expect(board.querySelectorAll("[data-trace]")).toHaveLength(8);
  },
};

export const MultipleBoards: Story = {
  render: () => (
    <>
      <Board map={homePc} />
      <Board map={homePc} />
    </>
  ),
  play: async ({ canvasElement }) => {
    const boards = within(canvasElement).getAllByRole("group", { name: "Home PC board" });
    await expect(boards).toHaveLength(2);
    const first = boards[0]?.querySelector("filter");
    const second = boards[1]?.querySelector("filter");
    await expect(first?.id).toBeTruthy();
    await expect(first?.id).not.toBe(second?.id);
  },
};

export const MidGame: Story = {
  args: {
    files: 8,
    filesInCore: 5,
    children: (
      <g role="img" aria-label="Friendly tower">
        <circle r="8" />
      </g>
    ),
  },
  play: async ({ canvasElement }) => {
    const board = within(canvasElement).getByRole("group", { name: "Home PC board" });
    await expect(
      within(board).getByRole("img", { name: "Core, 5 of 8 files" }),
    ).toBeInTheDocument();
    await expect(within(board).getByRole("img", { name: "Friendly tower" })).toBeInTheDocument();
  },
};
