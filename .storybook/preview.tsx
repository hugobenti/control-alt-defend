import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { DocsContainerProps } from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/nextjs-vite";

import "../src/app/globals.css";
import { display, num, ui } from "../src/app/fonts";

function FontDocsContainer({ children, ...props }: React.PropsWithChildren<DocsContainerProps>) {
  return (
    <div className={`${display.variable} ${ui.variable} ${num.variable}`}>
      <DocsContainer {...props}>{children}</DocsContainer>
    </div>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        className={`${display.variable} ${ui.variable} ${num.variable} bg-bg p-6 font-sans text-fg`}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: { test: "error" },
    docs: { container: FontDocsContainer },
    layout: "fullscreen",
  },
};

export default preview;
