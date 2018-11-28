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
        style={{ background: "#4c3c4c", width: "16rem" }}
      >
        <UserPanel user={user} />
        <Channel user={user} />
      </Menu>
    );
  }
}

export default SidePanel;

// <Grid className="panelBox">
//   <Grid.Column>
//     <Grid.Row>
//       <Header as="h1" color="grey" inverted textAlign="center">
//         <Icon name="code" />
//         Dev Desk
//       </Header>
//     </Grid.Row>
//     <Grid.Row>
//       <UserPanel />
//     </Grid.Row>
//   </Grid.Column>
// </Grid>
