import * as React from "react";
import { Menu, Icon, Modal, Button, Form, Input } from "semantic-ui-react";
import firebase from "../../../util/firebaseConfig";
import { connect } from "react-redux";
import {
  setChannel,
  setChannelID,
  setPrivateChannel,
  setActiveChannelID,
  setOtherChannels,
  setNotification
} from "../../../store/action";
import DisplayChannel from "./DisplayChannel";
import Spinner from "../../Spinner";
import * as notify from "../../../util/notification";
import * as typeFn from "../../../util/typingfn";

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
          createdBy: userID,
          createdOn: firebase.database.ServerValue.TIMESTAMP
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
    notify.clearNotification(channel.id, this.state.userID);
  };

  checkNotification = channelID => {
    const { messageRef } = this.state;
    messageRef.child(channelID).on("value", snap => {
      notify.createNotificationArray(
        snap.numChildren(),
        channelID,
        this.state.userID,
        this.props.activeChannelID
      );
    });
  };

  displayNotification = () => {
    const { notificationRef, userID } = this.state;
    notificationRef.child(userID).on("value", snap => {
      let notification = [];
      for (let info in snap.val()) {
        notification.push(snap.val()[info]);
      }
      this.props.setNotification(notification);
    });
  };

  render() {
    const { modal, channelName, channelDetail, loading } = this.state;
    const { channels, activeChannelID, user, notification } = this.props;
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
                </span>
                ({channels.length})
                <Icon name="add" onClick={this.handleOpenModal} />
              </Menu.Item>
              <DisplayChannel
                hideStarredID={user["starred"] ? user["starred"] : []}
                channels={channels}
                activeChannelID={activeChannelID}
                notification={notification}
                changeChannel={channel => {
                  typeFn.typingRemove(this.props.channel, user);
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

const mapStateToProps = ({ channel, notification }) => {
  return {
    activeChannelID: channel.activeChannelID,
    channels: channel.otherChannels,
    notification: notification.notification,
    channel: channel.currentChannel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    channelInStore: channelInfo => dispatch(setChannel(channelInfo)),
    channelID: id => dispatch(setChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setOtherChannels: channels => dispatch(setOtherChannels(channels)),
    setNotification: notifications => dispatch(setNotification(notifications))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channel);
