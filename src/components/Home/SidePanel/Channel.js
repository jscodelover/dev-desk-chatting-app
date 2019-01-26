import * as React from "react";
import { Menu, Icon, Modal, Button, Form, Input } from "semantic-ui-react";
import firebase from "firebase";
import { connect } from "react-redux";
import {
  setChannel,
  setChannelID,
  setPrivateChannel,
  setActiveChannelID,
  setOtherChannels
} from "../../../store/action";
import DisplayChannel from "./DisplayChannel";
import Spinner from "../../Spinner";

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.user.userID,
      modal: false,
      channelName: "",
      channelDetail: "",
      channelRef: firebase.database().ref("channels"),
      messageRef: firebase.database().ref("messages"),
      notificationRef: firebase.database().ref("notification"),
      activeChannelID: "",
      firstChannelActivated: false,
      notification: [],
      loading: false
    };
  }

  componentDidMount() {
    this.addListener();
  }

  componentWillUnmount() {
    this.removeListener();
  }

  addListener = () => {
    let loadedChannel = [];
    this.displayNotification();
    this.state.channelRef.on("child_added", snap => {
      this.setState({ loading: true });
      this.props.channelID(snap.val().id);
      loadedChannel.push(snap.val());
      this.props.setOtherChannels(loadedChannel);
      this.setFirstChannel();
      this.checkNotification(snap.val().id);
      this.setState({ loading: false });
    });
  };
  removeListener = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const { firstChannelActivated } = this.state;
    const { channels } = this.props;
    if (!firstChannelActivated) {
      this.setState({ firstChannelActivated: true });
      this.changeChannel(channels[0]);
    }
  };

  handleOpenModal = () => {
    this.setState({ modal: true });
  };
  handleCloseModal = () => {
    this.setState({ modal: false });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    let { channelName, channelDetail, channelRef, userID } = this.state;
    if (this.isFormValid(channelName, channelDetail)) {
      const key = channelRef.push().key;
      this.props.channelID(key);
      channelRef
        .child(key)
        .update({
          id: key,
          channelName,
          channelDetail,
          createdBy: userID
        })
        .then(() => {
          this.setState({
            channelName: "",
            channelDetail: ""
          });
          this.props.setActiveChannelID(key);
          this.handleCloseModal();
        });
    }
  };
  isFormValid = (channelName, channelDetail) => {
    return channelName.length && channelDetail.length;
  };

  changeChannel = channel => {
    this.props.setActiveChannelID(channel.id);
    this.props.channelInStore({ ...channel });
    this.props.setPrivateChannel(false);
    this.clearNotification(channel.id);
  };

  checkNotification = channelID => {
    const { messageRef } = this.state;
    messageRef.child(channelID).on("value", snap => {
      this.createNotificationArray(snap.numChildren(), channelID);
    });
  };

  createNotificationArray = (children, channelID) => {
    const { notificationRef, userID } = this.state;
    const { activeChannelID } = this.props;
    notificationRef.child(userID).once("value", snap => {
      if (!snap.hasChild(channelID)) {
        notificationRef
          .child(userID)
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
        if (notification.id === activeChannelID) {
          newNotification.count = 0;
          newNotification.lastTotal = children;
          notificationRef
            .child(userID)
            .child(channelID)
            .set({ ...newNotification });
        } else {
          newNotification.count = children - notification.lastTotal;
          newNotification.lastTotal = notification.lastTotal;
          notificationRef
            .child(userID)
            .child(channelID)
            .set({ ...newNotification });
        }
      }
    });
  };

  clearNotification = channelID => {
    const { notificationRef, userID } = this.state;
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
    const { notificationRef, userID } = this.state;
    notificationRef.child(userID).on("value", snap => {
      let notification = [];
      for (let info in snap.val()) {
        notification.push(snap.val()[info]);
      }
      this.setState({ notification });
    });
  };

  render() {
    const {
      modal,
      channelName,
      channelDetail,
      notification,
      loading
    } = this.state;
    const { channels, activeChannelID, user } = this.props;
    return (
      <React.Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Menu.Menu>
              <Menu.Item>
                <span>
                  <Icon name="discussions" /> Channel
                </span>{" "}
                ({channels.length}){" "}
                <Icon name="add" onClick={this.handleOpenModal} />
              </Menu.Item>
              <DisplayChannel
                starredID={user["starred"] ? user["starred"] : []}
                channels={channels}
                activeChannelID={activeChannelID}
                notification={notification}
                changeChannel={channel => {
                  this.changeChannel(channel);
                }}
              />
            </Menu.Menu>
            <Modal open={modal} basic onClose={this.handleCloseModal}>
              <Modal.Header>Add a Channel</Modal.Header>
              <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Field>
                    <Input
                      fluid
                      label="Name of Channel"
                      name="channelName"
                      onChange={this.handleChange}
                      value={channelName}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Input
                      fluid
                      label="About the Channel"
                      name="channelDetail"
                      onChange={this.handleChange}
                      value={channelDetail}
                    />
                  </Form.Field>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" inverted onClick={this.handleCloseModal}>
                  <Icon name="remove" /> No
                </Button>
                <Button color="green" inverted onClick={this.handleSubmit}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ channel }) => {
  return {
    activeChannelID: channel.activeChannelID,
    channels: channel.otherChannels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    channelInStore: channelInfo => dispatch(setChannel(channelInfo)),
    channelID: id => dispatch(setChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setOtherChannels: channels => dispatch(setOtherChannels(channels))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel);
