import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../../firebaseConfig";
import { setChannel } from "../../../store/action";

class DirectMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      connectionRef: firebase.database().ref(".info/connected"),
      persence: firebase.database().ref("presence"),
      totalUser: [],
      totalUserStatus: [],
      activeChannel: ""
    };
  }

  componentDidMount() {
    const { userRef, connectionRef, persence } = this.state;
    const { user } = this.props;
    let loadedUsers = [];
    userRef.on("value", snap => {
      for (let key in snap.val()) {
        if (user.userID !== snap.val()[key].userID) {
          loadedUsers.push(snap.val()[key]);
        }
      }
      this.setState({ totalUser: loadedUsers });
    });

    connectionRef.on("value", snap => {
      let status = persence.push({ [user.userID]: snap.val() });
      status.onDisconnect().remove();
      status.set({ [user.userID]: true });
      firebase
        .database()
        .ref(`users/${user.userID}`)
        .onDisconnect()
        .set({ ...user, lastSeen: firebase.database.ServerValue.TIMESTAMP });
    });

    persence.on("value", snap => {
      let persence = [];
      for (let key in snap.val()) {
        persence.push(snap.val()[key]);
      }
      this.setState({ totalUserStatus: persence });
    });
  }

  isOnline = userID => {
    this.state.totalUserStatus.forEach(status => {
      return status.hasOwnProperty(userID);
    });
  };

  //TODO: active channel need to make global so that their only 1 highlighted channel.
  changeChannel = user => {
    this.setState({ activeChannel: user.userID });
    this.props.setChannel({ channelName: user.username, id: user.userID });
  };

  displayUsers = totalUser =>
    totalUser.length &&
    totalUser.map(user => {
      return (
        <Menu.Item
          key={user.userID}
          active={user.userID === this.state.activeChannel}
          onClick={() => {
            this.changeChannel(user);
          }}
        >
          <span>{user.username}</span>
          <Icon
            name="circle"
            color={this.isOnline(user.userID) ? "green" : "red"}
          />
        </Menu.Item>
      );
    });

  render() {
    console.log(this.state);
    const { totalUser } = this.state;
    return (
      <Menu.Menu style={{ marginTop: "2rem" }}>
        <Menu.Item>
          <span>
            <Icon name="envelope" />
          </span>
          {` `} Direct Messages {` `} ({totalUser.length})
        </Menu.Item>
        {this.displayUsers(totalUser)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setChannel }
)(DirectMessage);
