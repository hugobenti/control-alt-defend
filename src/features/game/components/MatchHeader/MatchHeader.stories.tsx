import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import type { TGameSpeed } from "../SettingsMenu/SettingsMenu.type";
import { MatchHeader } from "./MatchHeader";
import type { IMatchHeaderProps } from "./MatchHeader.type";

const meta = {
  title: "Game/MatchHeader",
  component: MatchHeader,
  args: {
    level: { number: 1, name: "Home PC" },
    wave: { current: 7, total: 20 },
    nextWave: {
      phase: "break",
      preview: [
        { type: "worm", count: 6 },
        { type: "rootkit", count: 2 },
      ],
      secondsLeft: 12,
      earlyBonus: 6,
    },
    files: ["safe", "safe", "safe", "safe", "safe", "carried", "dropped", "leaked"],
    bits: 214,
    paused: false,
    speed: "1",
    defaultSpeed: "1",
    sound: true,
    settingsOpen: false,
    onPausedChange: fn(),
    onSpeedChange: fn(),
    onSoundChange: fn(),
    onSettingsOpenChange: fn(),
    onDefaultSpeedChange: fn(),
    onStartNow: fn(),
    onRestart: fn(),
    onQuit: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[1312px] pb-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatchHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BuildBreak: Story = {
  play: async ({ canvasElement, args }) => {
    const header = within(canvasElement).getByRole("banner", { name: "Match" });
    const canvas = within(header);
    await expect(canvas.getByText("in 0:12")).toBeInTheDocument();
    await expect(
      canvas.getByText("5 in the core, 1 carried, 1 dropped, 1 leaked"),
    ).toBeInTheDocument();
    await expect(canvas.getByText("214")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: /Start now/ }));
    await expect(args.onStartNow).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole("button", { name: "Pause" }));
    await expect(args.onPausedChange).toHaveBeenCalledWith(true);
    await userEvent.click(canvas.getByRole("button", { name: "2×" }));
    await expect(args.onSpeedChange).toHaveBeenCalledWith("2");
  },
};

export const WaveRunning: Story = {
  args: {
    nextWave: { phase: "running", preview: [], virusesLeft: 9 },
    speed: "2",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Wave 7 running")).toBeInTheDocument();
    await expect(canvas.getByText("9 viruses left")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "2×" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

function SettingsDemo(args: IMatchHeaderProps) {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [defaultSpeed, setDefaultSpeed] = useState<TGameSpeed>("1");
  return (
    <MatchHeader
      {...args}
      paused
      settingsOpen={open}
      onSettingsOpenChange={setOpen}
      sound={sound}
      onSoundChange={setSound}
      defaultSpeed={defaultSpeed}
      onDefaultSpeedChange={setDefaultSpeed}
    />
  );
}

export const SettingsKeyboard: Story = {
  render: (args) => <SettingsDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Paused")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Resume" })).toBeInTheDocument();
    const gear = canvas.getByRole("button", { name: "Settings" });
    await userEvent.click(gear);
    const dialog = canvas.getByRole("dialog", { name: "Settings" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.click(within(dialog).getByRole("switch", { name: "Sound effects" }));
    await expect(within(dialog).getByRole("switch", { name: "Sound effects" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "2×" }));
    await expect(within(dialog).getByRole("button", { name: "2×" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(gear).toHaveFocus();
  },
};

export const PausedWithSettings: Story = {
  args: { paused: true, settingsOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole("banner", { name: "Match" });
    const gear = canvas.getByRole("button", { name: "Settings" });
    const dialog = canvas.getByRole("dialog", { name: "Settings" });
    await expect(canvas.getByText("Paused")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Resume" })).toBeVisible();
    await expect(dialog).toBeVisible();
    const box = dialog.getBoundingClientRect();
    const gearBox = gear.getBoundingClientRect();
    await expect(box.top).toBeGreaterThanOrEqual(gearBox.bottom);
    await expect(Math.round(box.right)).toBe(Math.round(gearBox.right));
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.bottom).toBeLessThanOrEqual(window.innerHeight);
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    const level = canvas.getByText("Home PC").parentElement as HTMLElement;
    await expect(level.scrollWidth).toBeLessThanOrEqual(level.clientWidth);
    const pill = canvas.getByText("Paused");
    const wave = pill.nextElementSibling as HTMLElement;
    const gap = parseFloat(getComputedStyle(header).columnGap);
    const slack = wave.getBoundingClientRect().left - pill.getBoundingClientRect().right - gap;
    await expect(slack).toBeGreaterThanOrEqual(24);
  },
};

export const SettingsActions: Story = {
  args: { paused: true, settingsOpen: true },
  play: async ({ canvasElement, args }) => {
    const dialog = within(canvasElement).getByRole("dialog", { name: "Settings" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Restart level" }));
    await expect(args.onRestart).toHaveBeenCalledTimes(1);
    await userEvent.click(within(dialog).getByRole("button", { name: "Quit to level select" }));
    await expect(args.onQuit).toHaveBeenCalledTimes(1);
  },
};

export const LargeNumbers: Story = {
  args: {
    wave: { current: 30, total: 30 },
    bits: 99999,
    files: [
      "safe",
      "safe",
      "safe",
      "safe",
      "safe",
      "safe",
      "safe",
      "carried",
      "dropped",
      "dropped",
      "leaked",
      "leaked",
    ],
    nextWave: {
      phase: "break",
      preview: [
        { type: "worm", count: 12 },
        { type: "rootkit", count: 8 },
      ],
      secondsLeft: 59,
      earlyBonus: 120,
    },
  },
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole("banner", { name: "Match" });
    await expect(within(header).getByText("99999")).toBeInTheDocument();
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
  },
};

export const PausedLargeNumbers: Story = {
  ...LargeNumbers,
  args: { ...LargeNumbers.args, paused: true },
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole("banner", { name: "Match" });
    await expect(within(header).getByText("Paused")).toBeVisible();
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
  },
};
