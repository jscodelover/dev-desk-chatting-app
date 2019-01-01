import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channel from "./Channel";
import DirectMessage from "./DirectMessages";
import "./SidePanel.css";

class SidePanel extends Component {
  render() {
    const { user, otherUsers } = this.props;
    console.log(this.props);
    return (
      <Menu
        inverted
        fixed="left"
        vertical
        style={{ background: "#4c3c4c", width: "17rem", fontSize: "1.3rem" }}
      >
        <UserPanel user={user} />
        <Channel user={user} />
        <DirectMessage user={user} otherUsers={otherUsers} />
      </Menu>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user: user.currentUser,
    otherUsers: user.otherUsers
  };
};
export default connect(mapStateToProps)(SidePanel);
