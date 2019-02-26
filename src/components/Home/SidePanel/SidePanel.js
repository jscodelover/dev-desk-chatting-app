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
      visible: true
    };
  }
  toggleBtn = visible => {
    this.setState({ visible });
  };

  componentDidMount() {
    window.addEventListener("resize", () => {
      console.log(window.innerWidth);
      if (window.innerWidth <= 500) this.toggleBtn(false);
      else this.toggleBtn(true);
    });
  }

  render() {
    const { user } = this.props;
    const style = {
      background: user.color.theme[0],
      width: "17rem",
      fontSize: "1.3rem"
    };
    return (
      <React.Fragment>
        <Sidebar
          as={Menu}
          direction="right"
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={this.state.visible}
          style={{ ...style }}
        >
          <UserPanel user={user} />
          {user["starred"] ? <Starred /> : null}
          <Channel user={user} />
          <DirectMessage user={user} />
        </Sidebar>
      </React.Fragment>

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
