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
      connectionRef: firebase.database().ref(".info/connected"),
      persence: firebase.database().ref("presence"),
      totalUsers: [],
      totalUsersStatus: [],
      activeChannel: ""
    };
  }
  componentDidMount() {
    const { userRef, connectionRef, persence, } = this.state;
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
        let index = this.state.totalUsers.findIndex(user => user.userID === userID);
        let newtotalUsers = [...this.state.totalUsers];
        newtotalUsers[index] = snap.val();
        this.setState({ totalUsers : newtotalUsers });
    }
  });

    connectionRef.on("value", snap => {
      if(snap.val()){
        let status = persence.child(user.userID);
        status.set(true);
        status.onDisconnect().remove();
        firebase
        .database()
        .ref(`users/${user.userID}`)
        .onDisconnect()
        .set({ ...user, lastSeen: firebase.database.ServerValue.TIMESTAMP });
      }
    });

    persence.on("child_added", snap => {
      if(user.userID !== snap.key){
        this.addStatus(snap.key)
      }
    });
    persence.on("child_removed", snap => {
      if(user.userID !== snap.key){
        this.addStatus(snap.key, false);
      }
    });
  }

  addStatus = (userID, connected=true) =>{
    let updateStatus  = this.state.totalUsers.reduce((acc, user) => {
      if(user.userID === userID){
        user['status'] = connected ? 'online' : 'offline';
        firebase
        .database()
        .ref(`users/${user.userID}`)
        .set({ ...user, status: connected ? 'online' : 'offline' });
      }
      return acc.concat(user);
    },[]);
    console.log(updateStatus)
    this.setState({totalUsers: updateStatus});
  }

  //TODO: active channel need to make global so that their only 1 highlighted channel.
  changeChannel = user => {
    this.setState({ activeChannel: user.userID });
    this.props.setChannel({ channelName: user.username, id: `${user.userID}${this.props.user.userID}`, user: user });
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
            color={user.status === 'online' ? "green" : "red"}
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
        { totalUsers.length && this.displayUsers(totalUsers)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setChannel, setPrivateChannel }
)(DirectMessage);
