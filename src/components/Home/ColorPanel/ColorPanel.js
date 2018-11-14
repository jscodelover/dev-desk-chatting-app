import React from "react";
import { Menu, Sidebar, Button, Divider } from 'semantic-ui-react';

export default function ColorPanel() {
  return (
    <Sidebar
      as={Menu}
      width="very thin"
      inverted
      vertical
      visible
      icon="labeled"
    >
      <Divider />
      <Button icon="add" size="small" color="blue" />
    </Sidebar>
  );
}
