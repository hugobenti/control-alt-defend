import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { homePc } from "../../level/homePc.data";
import { createMatch } from "../../logic/match";
import { SandboxScreen } from "./SandboxScreen";

const initialState = createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 });
const meta = {
  title: "Game/SandboxScreen",
  component: SandboxScreen,
  parameters: { nextjs: { appDirectory: true } },
  args: { initialState },
} satisfies Meta<typeof SandboxScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PauseButton: Story = {
  play: async ({ canvasElement }) => {
    const pause = within(canvasElement).getByRole("button", { name: "Pause" });
    pause.focus();
    await userEvent.keyboard(" ");
    await expect(within(canvasElement).getByRole("button", { name: "Resume" })).toBeInTheDocument();
    await userEvent.keyboard(" ");
    await expect(within(canvasElement).getByRole("button", { name: "Pause" })).toBeInTheDocument();
  },
};

export const SpawnButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("application", { name: "Board" }).focus();
    await userEvent.keyboard("2");
    canvas.getByRole("button", { name: /^Spawn Worm/ }).focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getAllByRole("img", { name: /^Worm, / })).toHaveLength(1));
    await expect(canvas.getByRole("img", { name: "Valid placement" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("img", { name: "Antivirus v1.0" }).closest('[aria-label="Valid placement"]'),
    ).toBeInTheDocument();
  },
};

export const BoardTab: Story = {
  play: async ({ canvasElement }) => {
    const board = within(canvasElement).getByRole("application", { name: "Board" });
    board.focus();
    await userEvent.keyboard("{Tab}");
    await expect(document.activeElement).not.toBe(board);
  },
};

export const SettingsEscape: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const board = canvas.getByRole("application", { name: "Board" });
    board.focus();
    await userEvent.keyboard("2");
    await userEvent.click(canvas.getByRole("button", { name: "Settings" }));
    await expect(canvas.getByText("Settings", { selector: "h3" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByText("Settings", { selector: "h3" })).not.toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "Valid placement" })).toBeInTheDocument();
    board.focus();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("img", { name: "Valid placement" })).not.toBeInTheDocument();
  },
};

export const SettingsEscapeOutside: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const board = canvas.getByRole("application", { name: "Board" });
    board.focus();
    await userEvent.keyboard("2");
    await userEvent.click(canvas.getByRole("button", { name: "Settings" }));
    board.focus();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "Valid placement" })).toBeInTheDocument();
  },
};

export const RestartFromSettings: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const board = canvas.getByRole("application", { name: "Board" });
    await userEvent.click(canvas.getByRole("button", { name: "Settings" }));
    await userEvent.click(canvas.getByRole("button", { name: "Restart level" }));
    await expect(board).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(canvas.getByRole("button", { name: "Resume" })).toBeInTheDocument();
  },
};

const ending = createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 });
const doomed = {
  ...ending,
  files: ending.files.map((file, index) => ({
    ...file,
    status: index === 7 ? ("carried" as const) : ("leaked" as const),
  })),
  enemies: [
    {
      id: 1,
      type: "worm" as const,
      small: false,
      pos: { x: 950, y: 500 },
      heading: 0,
      health: 1,
      maxHealth: 1,
      carrying: 7,
      offset: { x: 0, y: 0 },
      hitUntilTick: 0,
      touchedEmptyCore: false,
    },
  ],
};

export const GameOver: Story = {
  args: { initialState: doomed },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Game over" }, { timeout: 2000 });
    const restart = within(dialog).getByRole("button", { name: "Restart" });
    await expect(restart).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(restart).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect(restart).toHaveFocus();
    const background = canvas.getByRole("button", { name: /\+1000 bits/, hidden: true });
    await expect(background.closest("[inert]")).not.toBeNull();
    background.focus();
    await expect(restart).toHaveFocus();
    await userEvent.click(restart);
    await expect(canvas.getByRole("application", { name: "Board" })).toHaveFocus();
    await expect(
      canvas.getByTitle("8 in the core, 0 carried, 0 dropped, 0 leaked"),
    ).toBeInTheDocument();
  },
};
