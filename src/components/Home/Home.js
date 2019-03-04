import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../util/firebaseConfig";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import { setShowChannelInfo } from "../../store/action";
import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      visible: window.innerWidth > 678
    };
  }
  componentDidMount() {
    this.checkWidth();
    this.removeToken();
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

  checkWidth = () => {
    window.addEventListener("resize", () => {
      this.setState({ visible: window.innerWidth > 678 });
    });
  };

  removeToken = () => {
    firebase
      .database()
      .ref("tokens")
      .orderByChild("uid")
      .equalTo(firebase.auth().currentUser.uid)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          const key = Object.keys(snapshot.val());
          if (key.length > 1)
            firebase
              .database()
              .ref("tokens")
              .child(key[0])
              .remove();
        }
      });
  };

  showSidebar = () => {
    this.setState(prevState => ({ isShow: !prevState.isShow }));
  };

  render() {
    const {
      user,
      channel,
      privateChannel,
      otherUsers,
      usersInChannel,
      showChannelInfo
    } = this.props;
    const { visible, isShow } = this.state;
    const visibleSideBar = visible ? visible : isShow;
    return (
      <Grid
        columns="equal"
        style={{
          background: "#fff",
          marginTop: "0px",
          height: "100vh",
          margin: 0
        }}
      >
        {/* <ColorPanel user={user} />
        {user.userID && <SidePanel />}

        <Grid.Column
          style={{ marginLeft: "312px", position: "relative", paddingRight: 0 }}
        >
          {channel.id && <Messages />}
        </Grid.Column>

        {!privateChannel && showChannelInfo && otherUsers.length && (
          <Grid.Column width={4}>
            <MetaPanel
              channel={channel}
              otherUsers={otherUsers}
              user={user}
              usersInChannel={usersInChannel}
              showChannelInfo={() => {
                this.props.setShowChannelInfo(false);
              }}
            />
          </Grid.Column>
        )} */}
        <Grid.Column className="my-container">
          {channel.id && <Messages />}
        </Grid.Column>

        {user.userID && (
          <SidePanel
            visibleSideBar={visibleSideBar}
            user={user}
            showSidebar={this.showSidebar}
          />
        )}

        <ColorPanel user={user} showSidebar={this.showSidebar} />
        {!privateChannel &&
          showChannelInfo &&
          otherUsers.length && (
            <div className="metapannel-box">
              <MetaPanel
                channel={channel}
                otherUsers={otherUsers}
                user={user}
                usersInChannel={usersInChannel}
                showChannelInfo={() => {
                  this.props.setShowChannelInfo(false);
                }}
              />
            </div>
          )}
      </Grid>
    );
  }
}

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    otherUsers: user.otherUsers,
    channel: channel.currentChannel,
    privateChannel: channel.privateChannel,
    usersInChannel: channel.usersInChannel,
    showChannelInfo: channel.showChannelInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setShowChannelInfo: payload => dispatch(setShowChannelInfo(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
