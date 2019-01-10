import * as React from "react";
import {
  Menu,
  Icon,
  Modal,
  Button,
  Form,
  Input,
  Label
} from "semantic-ui-react";
import firebase from "firebase";
import { connect } from "react-redux";
import {
  setChannel,
  setChannelID,
  setPrivateChannel
} from "../../../store/action";

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.user.userID,
      channels: [],
      modal: false,
      channelName: "",
      channelDetail: "",
      channelRef: firebase.database().ref("channels"),
      messageRef: firebase.database().ref("messages"),
      notificationRef: firebase.database().ref("notification"),
      activeChannelID: "",
      firstChannelActivated: false,
      notification: []
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
    this.state.channelRef.on("child_added", snap => {
      this.props.channelID(snap.val().id);
      loadedChannel.push(snap.val());
      this.setState({ channels: loadedChannel }, () => {
        this.setFirstChannel();
        this.checkNotification(snap.val().id);
      });
    });
    this.displayNotification();
  };
  removeListener = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const { firstChannelActivated, channels } = this.state;
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
            channelDetail: "",
            activeChannelID: key
          });
          this.handleCloseModal();
        });
    }
  };
  isFormValid = (channelName, channelDetail) => {
    return channelName.length && channelDetail.length;
  };

  changeChannel = channel => {
    this.setState({ activeChannelID: channel.id });
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
    const { notificationRef, activeChannelID, userID } = this.state;
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

        console.log(channelID, children, notification.lastTotal);
        if (notification.id === activeChannelID) {
          newNotification.count = 0;
          newNotification.lastTotal = children;
          notificationRef
            .child(userID)
            .child(channelID)
            .set({ ...newNotification });
        } else {
          console.log(channelID, children);
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
      this.setState({ notification: snap.val() });
    });
  };

  displayChannels = state =>
    state.channels.length > 0 &&
    state.channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.channelName}
        onClick={() => {
          this.changeChannel(channel);
        }}
        active={channel.id === state.activeChannelID}
      >
        <span># {channel.channelName}</span>
        <Label color="red">{state.notification[channel.id]["count"]}</Label>
      </Menu.Item>
    ));

  render() {
    const { channels, modal, channelName, channelDetail } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu>
          <Menu.Item>
            <span>
              <Icon name="discussions" /> Channel
            </span>{" "}
            ({channels.length}){" "}
            <Icon name="add" onClick={this.handleOpenModal} />
          </Menu.Item>
          {this.displayChannels(this.state)}
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
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    channelInStore: channelInfo => dispatch(setChannel(channelInfo)),
    channelID: id => dispatch(setChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Channel);
