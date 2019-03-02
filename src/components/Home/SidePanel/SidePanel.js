import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Sidebar } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channel from "./Channel";
import DirectMessage from "./DirectMessages";
import Starred from "./Starred";

class SidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: window.innerWidth > 678
    };
  }
  toggleBtn = visible => {
    this.setState({ visible });
  };

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({ visible: window.innerWidth > 678 });
    });
  }

  render() {
    const { user, show } = this.props;
    const { visible } = this.state;
    const style = {
      background: user.color.theme[0],
      width: "17rem",
      fontSize: "1.3rem"
    };
    const visibleSideBar = visible ? visible : show;
    return (
      <Sidebar
        as={Menu}
        direction="right"
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={visibleSideBar}
        style={{ ...style }}
      >
        <UserPanel user={user} />
        {user["starred"] ? <Starred /> : null}
        <Channel user={user} />
        <DirectMessage user={user} />
      </Sidebar>
      // <Menu inverted fixed="right" vertical style={{ ...style }}>
      //   <UserPanel user={user} />
      //   {user["starred"] ? <Starred /> : null}
      //   <Channel user={user} />
      //   <DirectMessage user={user} />
      // </Menu>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user: user.currentUser
  };
};
export default connect(mapStateToProps)(SidePanel);
