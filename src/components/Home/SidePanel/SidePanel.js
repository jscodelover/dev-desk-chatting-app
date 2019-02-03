import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channel from "./Channel";
import DirectMessage from "./DirectMessages";
import Starred from "./Starred";

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
        {user["starred"] ? <Starred /> : null}
        <Channel user={user} />
        <DirectMessage user={user} />
      </Menu>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user: user.currentUser
  };
};
export default connect(mapStateToProps)(SidePanel);
