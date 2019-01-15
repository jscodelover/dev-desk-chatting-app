import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebaseConfig";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

class Home extends React.Component {
  componentDidMount() {
    firebase
      .database()
      .ref("tokens")
      .orderByChild("uid")
      .equalTo(firebase.auth().currentUser.uid)
      .once("value")
      .then(snapshot => {
        const key = Object.keys(snapshot.val())[0];
        firebase
          .database()
          .ref("tokens")
          .child(key)
          .remove();
      });

    firebase.messaging().onTokenRefresh(
      firebase
        .messaging()
        .requestPermission()
        .then(() =>
          firebase
            .messaging()
            .getToken()
            .then(token => {
              firebase
                .database()
                .ref("tokens")
                .push({
                  token: token,
                  uid: firebase.auth().currentUser.uid
                });
            })
        )
        .catch(err => {
          console.log("Error Getting Permission");
        })
    );
  }

  render() {
    const { user, channel } = this.props;
    return (
      <Grid
        columns="equal"
        style={{ background: "#eee", marginTop: "0px", height: "100vh" }}
      >
        <ColorPanel />
        {user.userID && <SidePanel />}

        <Grid.Column style={{ marginLeft: "315px", position: "relative" }}>
          {channel.id && <Messages />}
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    channel: channel.currentChannel
  };
};

export default connect(mapStateToProps)(Home);
