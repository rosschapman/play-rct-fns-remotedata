import React from "react";
import { action } from "@storybook/addon-actions";
import { Combobox } from "./Combobox";

export default {
  title: "Combobox",
  component: Combobox,
};

export const Emoji = () => (
  <Button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
