import * as React from "react";
import { Menu, Icon, Modal, Button, Form, Input } from "semantic-ui-react";
import firebase from 'firebase';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: [],
      modal: false,
      channelName: "",
      channelDetail: "",
      channelRef: firebase.database().ref('channels')
    };
  }

  componentDidMount(){

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

  handleSubmit = () => {
    console.log("in submit")
    if(this.isFormValid()){
      console.log("send")
    }
  } 

  isFormValid = () => {
    return this.state.channelName.length && this.state.channelDetail.length;
  }

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
        <Modal open={modal} basic onClose={this.handleCloseModal} >
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
          <Modal.Actions onSubmit={this.handleSubmit}>
            <Button color="red" inverted onClick={this.handleCloseModal}>
              <Icon name="remove" /> No
            </Button>
            <Button color="green" inverted>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Channel;
