import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import DisplayChannel from "./DisplayChannel";
import {
  setChannel,
  setPrivateChannel,
  setActiveChannelID,
  setNotification
} from "../../../store/action";
import firebase from "../../../util/firebaseConfig";
import * as notify from "../../../util/notification";
import generateId from "../../../util/directmessage";

class Starred extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideStarredID_ForChannel: [],
      hideStarredID_ForUser: [],
      messageRef: firebase.database().ref("messages"),
      notificationRef: firebase.database().ref("notification")
    };
  }
  componentDidMount() {
    this.displayNotification();
    this.findHiddenStarredID();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.starred !== this.props.starred) this.findHiddenStarredID();
  }

  findHiddenStarredID = () => {
    const { otherUsers, channelIDs, starred } = this.props;
    let hideForChannel = channelIDs.reduce((acc, channel_id) => {
      let result = starred.includes(channel_id);
      if (!result && (acc.length === 0 || !acc.includes(result))) {
        this.checkNotificationChannel(channel_id);
        return acc.concat(channel_id);
      }
      return acc;
    }, []);
    this.setState({ hideStarredID_ForChannel: hideForChannel });

    let hideForUser = otherUsers.reduce((acc, user) => {
      let result = starred.includes(user.userID);
      if (!result && (acc.length === 0 || !acc.includes(result))) {
        this.checkNotificationUser(generateId(user, this.props.user.userID));
        return acc.concat(user.userID);
      }
      return acc;
    }, []);
    this.setState({ hideStarredID_ForUser: hideForUser });
  };

  changeChannel = channel => {
    this.props.setActiveChannelID(channel.id);
    this.props.setChannel({ ...channel });
    this.props.setPrivateChannel(false);
    notify.clearNotification(channel.id, this.props.user.userID);
  };

  changeUser = user => {
    this.props.setActiveChannelID(user.userID);
    this.props.setChannel({
      channelName: user.username,
      id: this.generateId(user)
    });
    this.props.setPrivateChannel(true);
    notify.clearNotification(
      generateId(user, this.props.user.userID),
      this.props.user.userID
    );
  };

  checkNotificationChannel = channelID => {
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

  checkNotificationUser = channelID => {
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
    const { hideStarredID_ForChannel, hideStarredID_ForUser } = this.state;
    const {
      otherChannels,
      otherUsers,
      activeChannelID,
      user,
      notification
    } = this.props;
    return (
      <Menu.Menu style={{ marginBottom: "2rem" }}>
        <Menu.Item>
          <span>
            <Icon name="star" /> Starred
          </span>
        </Menu.Item>
        <DisplayChannel
          hideStarredID={hideStarredID_ForChannel}
          channels={otherChannels}
          activeChannelID={activeChannelID}
          notification={notification}
          changeChannel={channel => {
            this.changeChannel(channel);
          }}
        />
        <DisplayChannel
          hideStarredID={hideStarredID_ForUser}
          users={otherUsers}
          activeChannelID={activeChannelID}
          notification={notification}
          userID={user.userID}
          changeChannel={user => {
            this.changeUser(user);
          }}
        />
      </Menu.Menu>
    );
  }
}

const mapStateToProps = ({ user, channel, notification }) => {
  return {
    otherUsers: user.otherUsers,
    otherChannels: channel.otherChannels,
    channelIDs: channel.channelIDs,
    activeChannelID: channel.activeChannelID,
    starred: user.currentUser.starred.split(","),
    user: user.currentUser,
    notification: notification.notification
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setChannel: channelInfo => dispatch(setChannel(channelInfo)),
    setNotification: notifications => dispatch(setNotification(notifications))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Starred);
