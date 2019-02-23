import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../../util/firebaseConfig";
import DisplayChannel from "../SidePanel/DisplayChannel";
import {
  setChannel,
  setPrivateChannel,
  setActiveChannelID,
  setOtherUsers,
  setNotification,
  clearMessages
} from "../../../store/action";
import Spinner from "../../Spinner";
import * as notify from "../../../util/notification";
import generateId from "../../../util/directmessage";
import * as typeFn from "../../../util/typingfn";

class DirectMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      messageRef: firebase.database().ref("messages"),
      notificationRef: firebase.database().ref("notification"),
      activeChannel: "",
      loading: false
    };
  }
  componentDidMount() {
    const { userRef } = this.state;
    const { user } = this.props;
    let loadedUsers = [];
    this.displayNotification();
    userRef.on("child_added", snap => {
      this.setState({ loading: true });
      if (user.userID !== snap.val().userID) {
        loadedUsers.push(snap.val());
        this.props.setOtherUsers(loadedUsers);
        this.checkNotification(generateId(snap.val(), this.props.user.userID));
        this.setState({ loading: false });
      }
    });

    userRef.on("child_changed", snap => {
      if (user.userID !== snap.val().userID) {
        let userID = snap.val().userID;
        let index = this.props.totalUsers.findIndex(
          user => user.userID === userID
        );
        let newtotalUsers = [...this.props.totalUsers];
        newtotalUsers[index] = snap.val();
        this.props.setOtherUsers(newtotalUsers);
      }
    });
  }

  componentWillUnmount() {
    this.state.userRef.off();
  }

  changeChannel = user => {
    this.props.setActiveChannelID(user.userID);
    this.props.setChannel({
      channelName: user.username,
      id: generateId(user, this.props.user.userID)
    });
    this.props.setPrivateChannel(true);
    notify.clearNotification(
      generateId(user, this.props.user.userID),
      this.props.user.userID
    );
    this.props.clearMessages();
  };

  checkNotification = channelID => {
    const { messageRef } = this.state;
    messageRef.child(channelID).on("value", snap => {
      notify.createNotificationArray(
        snap.numChildren(),
        channelID,
        this.props.user.userID,
        this.props.activeChannelID
      );
    });
  };

  displayNotification = () => {
    const { notificationRef } = this.state;
    const { userID } = this.props.user;
    notificationRef.child(userID).on("value", snap => {
      let notification = [];
      for (let info in snap.val()) {
        notification.push(snap.val()[info]);
      }
      this.props.setNotification(notification);
    });
  };

  render() {
    const { loading } = this.state;
    const {
      activeChannelID,
      user,
      totalUsers,
      notification,
      channel
    } = this.props;
    return (
      <React.Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <Menu.Menu style={{ marginTop: "2rem" }}>
            <Menu.Item>
              <span style={{ fontWeight: "bold", color: user.color.text }}>
                <Icon name="envelope" /> Direct Messages {` `} (
                {totalUsers.length})
              </span>
            </Menu.Item>
            {totalUsers.length ? (
              <DisplayChannel
                hideStarredID={user["starred"] ? user["starred"] : []}
                users={totalUsers}
                activeChannelID={activeChannelID}
                notification={notification}
                userID={user.userID}
                textColor={user.color.text}
                changeChannel={user => {
                  typeFn.typingRemove(channel, this.props.user);
                  this.changeChannel(user);
                }}
              />
            ) : (
              ""
            )}
          </Menu.Menu>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ channel, user, notification }) => {
  return {
    activeChannelID: channel.activeChannelID,
    totalUsers: user.otherUsers,
    notification: notification.notification,
    channel: channel.currentChannel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setChannel: channelInfo => dispatch(setChannel(channelInfo)),
    setOtherUsers: users => dispatch(setOtherUsers(users)),
    setNotification: notifications => dispatch(setNotification(notifications)),
    clearMessages: () => dispatch(clearMessages())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectMessage);
