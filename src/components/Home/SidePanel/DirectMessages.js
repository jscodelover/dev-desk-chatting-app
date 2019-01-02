import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../../firebaseConfig";
import { setChannel, setPrivateChannel } from "../../../store/action";

class DirectMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      totalUsers: [],
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
        this.setState({ totalUsers: loadedUsers });
      }
    });

    userRef.on("child_changed", snap => {
      if (user.userID !== snap.val().userID) {
        let userID = snap.val().userID;
        let index = this.state.totalUsers.findIndex(
          user => user.userID === userID
        );
        let newtotalUsers = [...this.state.totalUsers];
        newtotalUsers[index] = snap.val();
        this.setState({ totalUsers: newtotalUsers });
      }
    });
  }

  //TODO: active channel need to make global so that there is only 1 highlighted channel.
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
    const { totalUsers } = this.state;
    return (
      <Menu.Menu style={{ marginTop: "2rem" }}>
        <Menu.Item>
          <span>
            <Icon name="envelope" />
          </span>
          {` `} Direct Messages {` `} ({totalUsers.length})
        </Menu.Item>
        {totalUsers.length && this.displayUsers(totalUsers)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setChannel, setPrivateChannel }
)(DirectMessage);
