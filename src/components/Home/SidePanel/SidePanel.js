import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channel from "./Channel";
import "./SidePanel.css";

class SidePanel extends Component {
  render() {
    const { user } = this.props;
    return (
      <Menu
        inverted
        fixed="left"
        vertical
        style={{ background: "#4c3c4c", width: "17rem", fontSize: "1.3rem" }}
      >
        <UserPanel user={user} />
        <Channel user={user} />
      </Menu>
    );
  }
}

export default SidePanel;
