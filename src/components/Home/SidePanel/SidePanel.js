import React from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channel from "./Channel";
import DirectMessage from "./DirectMessages";
import Starred from "./Starred";

const SidePanel = ({ user, visibleSideBar }) => {
  const style = {
    background: user.color.theme[0],
    width: "17rem",
    fontSize: "1.3rem",
    zIndex: 500
  };
  console.log(visibleSideBar);
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
};

export default SidePanel;
