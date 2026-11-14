import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Icon } from "./Icon";
import type { TIconName } from "./Icon.type";

const names: TIconName[] = [
  "pause",
  "play",
  "sound",
  "sound-off",
  "gear",
  "lock",
  "bits",
  "block",
  "check",
  "forward",
];

const meta = {
  title: "Components/Icon",
  component: Icon,
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: { name: "play" },
  render: () => (
    <div className="flex flex-wrap gap-6 text-accent">
      {names.map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByText(/pause|play|sound|gear|lock|bits|block|check|forward/),
    ).toHaveLength(10);
    await expect(canvasElement.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(10);
    await expect(canvasElement.querySelectorAll("svg path[d]")).toHaveLength(10);
  },
};
