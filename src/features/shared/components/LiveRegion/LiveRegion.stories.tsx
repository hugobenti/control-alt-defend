import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { LiveRegion } from "./LiveRegion";
import { useLiveRegion } from "./useLiveRegion";

function Announcer() {
  const { message, slot, announce } = useLiveRegion();
  return (
    <>
      <button onClick={() => announce("File recovered")}>Announce</button>
      <LiveRegion message={message} slot={slot} />
    </>
  );
}

const meta = { title: "Shared/LiveRegion", component: LiveRegion } satisfies Meta<
  typeof LiveRegion
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Announcement: Story = {
  args: { message: "", slot: 0 },
  render: () => <Announcer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Announce" }));
    expect(
      canvas.getAllByRole("status").filter((node) => node.textContent === "File recovered"),
    ).toHaveLength(1);
  },
};
