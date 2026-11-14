import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const meta = {
  title: "Foundations/Fonts",
  render: () => <h1 className="font-display">Chakra Petch</h1>,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading", { name: "Chakra Petch" });
    await document.fonts.ready;
    const loaded = [...document.fonts].filter(
      (face) => face.family.replaceAll('"', "") === "Chakra Petch" && face.status === "loaded",
    );
    await expect(loaded.length).toBeGreaterThan(0);
    await expect(getComputedStyle(heading).fontFamily).toContain("Chakra Petch");
  },
};
