import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

const Home = ({ user, channel }) => {
  return (
    <Grid
      columns="equal"
      style={{ background: "#eee", marginTop: "0px", height: "100vh" }}
    >
      <ColorPanel />
      {user.userID && <SidePanel user={user} />}

      <Grid.Column style={{ marginLeft: "300px", position: "relative" }}>
        {channel.id && <Messages user={user} channelID={channel.id} />}
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    channel: channel.currentChannel
  };
};

export default connect(mapStateToProps)(Home);
