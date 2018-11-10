import * as React from "react";
import { Menu, Icon, Modal, Button, Form, Input } from "semantic-ui-react";

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: [],
      modal: false,
      channelName: "",
      channelDetail: ""
    };
  }

  handleOpenModal = () => {
    this.setState({ modal: true });
  };

  handleCloseModal = () => {
    this.setState({ modal: false });
  };
  handleCreateChannel = () => {
    console.log("channel created");
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { channel, modal, channelName, channelDetail } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> Channel
            </span>{" "}
            ({channel.length}){" "}
            <Icon name="add" onClick={this.handleOpenModal} />
          </Menu.Item>
        </Menu.Menu>
        <Modal open={modal} basic onClose={this.handleCloseModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
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
            <Button color="green" inverted onClick={this.handleCreateChannel}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Channel;
