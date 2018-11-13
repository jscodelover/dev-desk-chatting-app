import * as React from "react";
import { Menu, Icon, Modal, Button, Form, Input } from "semantic-ui-react";
import firebase from "firebase";

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.user.userID,
      channels: [],
      modal: false,
      channelName: "",
      channelDetail: "",
      channelRef: firebase.database().ref("channels")
    };
  }

  componentDidMount() {
    this.state.channelRef.on("child_added", snap => {
      let channel = this.state.channels;
      channel.push(snap.val());
      this.setState({ channels: channel });
    });
  }

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
      console.log("send");
      const key = channelRef.push().key;
      channelRef.child(key).update({
        channelName,
        channelDetail,
        createdBy: userID
      });
    }
  };

  isFormValid = (channelName, channelDetail) => {
    return channelName.length && channelDetail.length;
  };

  displayChannels = channels => {
    console.log("display");
    channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item onClick={console.log(channel)} style={{ opacity: "0.7" }}>
          {channel.channelName}
        </Menu.Item>
      ));
  };

  render() {
    const { channels, modal, channelName, channelDetail } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> Channel
            </span>{" "}
            ({channels.length}){" "}
            <Icon name="add" onClick={this.handleOpenModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
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

export default Channel;
