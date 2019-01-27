import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../../firebaseConfig";
import DisplayChannel from "../SidePanel/DisplayChannel";
import {
  setChannel,
  setPrivateChannel,
  setActiveChannelID,
  setOtherUsers
} from "../../../store/action";
import Spinner from "../../Spinner";

class DirectMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      messageRef: firebase.database().ref("messages"),
      notificationRef: firebase.database().ref("notification"),
      activeChannel: "",
      notification: [],
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
    this.clearNotification(this.generateId(user));
  };

  // TODO: Notification function need to be set
  checkNotification = channelID => {
    const { messageRef } = this.state;
    messageRef.child(channelID).on("value", snap => {
      this.createNotificationArray(snap.numChildren(), channelID);
    });
  };

  createNotificationArray = (children, channelID) => {
    const { notificationRef } = this.state;
    const { activeChannelID, user } = this.props;
    notificationRef.child(user.userID).once("value", snap => {
      if (!snap.hasChild(channelID)) {
        notificationRef
          .child(user.userID)
          .child(channelID)
          .update({
            id: channelID,
            lastTotal: children,
            count: 0,
            total: children
          });
      } else {
        let notification = snap.val()[channelID];
        let newNotification = {
          id: channelID,
          total: children
        };
        if (notification["id"].includes(activeChannelID)) {
          newNotification.count = 0;
          newNotification.lastTotal = children;
          notificationRef
            .child(user.userID)
            .child(channelID)
            .set({ ...newNotification });
        } else {
          newNotification.count = children - notification.lastTotal;
          newNotification.lastTotal = notification.lastTotal;
          notificationRef
            .child(user.userID)
            .child(channelID)
            .set({ ...newNotification });
        }
      }
    });
  };

  clearNotification = channelID => {
    const { notificationRef } = this.state;
    const { userID } = this.props.user;
    notificationRef
      .child(userID)
      .child(channelID)
      .once("value", snap => {
        let notification = snap.val();
        notificationRef
          .child(userID)
          .child(channelID)
          .set({
            id: channelID,
            lastTotal: notification.total,
            count: 0,
            total: notification.total
          });
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
      this.setState({ notification });
    });
  };

  render() {
    const { notification, loading } = this.state;
    const { activeChannelID, user, totalUsers } = this.props;
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

const mapStateToProps = ({ channel, user }) => {
  return {
    activeChannelID: channel.activeChannelID,
    totalUsers: user.otherUsers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setChannel: channelInfo => dispatch(setChannel(channelInfo)),
    setOtherUsers: users => dispatch(setOtherUsers(users))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectMessage);
