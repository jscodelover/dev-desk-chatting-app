import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../../firebaseConfig";
import {
  setChannel,
  setPrivateChannel,
  setOtherUsers
} from "../../../store/action";

class DirectMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      activeChannel: ""
    };
  }
  componentDidMount() {
    const { userRef } = this.state;
    const { user } = this.props;
    let loadedUsers = [];
    userRef.on("child_added", snap => {
      if (user.userID !== snap.val().userID) {
        loadedUsers.push(snap.val());
        this.props.setOtherUsers(loadedUsers);
      }
    });

    userRef.on("child_changed", snap => {
      if (user.userID !== snap.val().userID) {
        let userID = snap.val().userID;
        let index = this.props.otherUsers.findIndex(
          user => user.userID === userID
        );
        let newtotalUsers = [...this.props.otherUsers];
        newtotalUsers[index] = snap.val();
        this.props.setOtherUsers(newtotalUsers);
      }
    });
  }

  //TODO: active channel need to make global so that their only 1 highlighted channel.
  changeChannel = user => {
    this.setState({ activeChannel: user.userID });
    this.props.setChannel({
      channelName: user.username,
      id: `${user.userID},${this.props.user.userID}`
    });
    this.props.setPrivateChannel(true);
  };

  displayUsers = totalUsers =>
    totalUsers.length &&
    totalUsers.map(user => {
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
            color={user.status === "online" ? "green" : "red"}
          />
        </Menu.Item>
      );
    });

  render() {
    const { otherUsers } = this.props;
    return (
      <Menu.Menu style={{ marginTop: "2rem" }}>
        <Menu.Item>
          <span>
            <Icon name="envelope" />
          </span>
          {` `} Direct Messages {` `} ({otherUsers.length})
          {console.log(otherUsers)}
        </Menu.Item>
        {otherUsers.length && this.displayUsers(otherUsers)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setChannel, setPrivateChannel, setOtherUsers }
)(DirectMessage);
