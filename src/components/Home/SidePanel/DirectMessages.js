import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../../firebaseConfig";
import DisplayChannel from "../SidePanel/DisplayChannel";
import {
  setChannel,
  setPrivateChannel,
  setActiveChannelID,
  setOtherUsers,
  setNotification
} from "../../../store/action";
import Spinner from "../../Spinner";
import * as notify from "../../../util/notification";

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
        this.checkNotification(this.generateId(snap.val()));
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

  generateId = user => {
    return user.userID > this.props.user.userID
      ? `${user.userID}${this.props.user.userID}`
      : `${this.props.user.userID}${user.userID}`;
  };

  changeChannel = user => {
    this.props.setActiveChannelID(user.userID);
    this.props.setChannel({
      channelName: user.username,
      id: this.generateId(user)
    });
    this.props.setPrivateChannel(true);
    notify.clearNotification(this.generateId(user), this.props.user.userID);
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
    const { activeChannelID, user, totalUsers, notification } = this.props;
    return (
      <React.Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <Menu.Menu style={{ marginTop: "2rem" }}>
            <Menu.Item>
              <span>
                <Icon name="envelope" />
              </span>
              {` `} Direct Messages {` `} ({totalUsers.length})
            </Menu.Item>
            {totalUsers.length ? (
              <DisplayChannel
                hideStarredID={user["starred"] ? user["starred"] : []}
                users={totalUsers}
                activeChannelID={activeChannelID}
                notification={notification}
                userID={this.props.user.userID}
                changeChannel={user => {
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
    notification: notification.notification
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setChannel: channelInfo => dispatch(setChannel(channelInfo)),
    setOtherUsers: users => dispatch(setOtherUsers(users)),
    setNotification: notifications => dispatch(setNotification(notifications))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectMessage);
