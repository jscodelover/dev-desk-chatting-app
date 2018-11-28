import * as React from "react";
import { Segment, Button, Input, Icon } from "semantic-ui-react";
import firebase from "../../../firebaseConfig";
import FileModal from "./FileModal";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      loading: false,
      error: [],
      modal: false
    };
  }

  getMessage = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  sendMessage = () => {
    const { messageRef, channelID, user } = this.props;
    if (this.state.message) {
      this.setState({ loading: true });
      messageRef
        .child(channelID)
        .push()
        .set({
          content: this.state.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          user: {
            username: user.username,
            picture: user.picture,
            userID: user.userID
          }
        })
        .then(() => {
          this.setState({ loading: false, message: "" });
        })
        .catch(() => {
          this.setState({
            loading: false,
            error: this.state.error.concat(
              "message can't be send. Try Again !!"
            )
          });
        });
    } else {
      this.setState({
        loading: false,
        error: this.state.error.concat("write the message")
      });
    }
  };

  openModal = () => {
    this.setState({modal: true})
  }

  closeModal = () => {
    this.setState({modal: false})
  }

  uploadFile = (file) => {
    console.log(file.type)
  }

  render() {
    const { message, error, loading, modal } = this.state;
    return (
      <Segment className="messageForm">
        <Input
          fluid
          style={{ marginBottom: "0.7rem" }}
          label={
            <Button icon>
              {" "}
              <Icon name="add" />
            </Button>
          }
          name="message"
          value={message}
          onChange={this.getMessage}
          loading={loading}
          labelPosition="left"
          placeholder="Write your message..."
          className={error.some(err => err.includes("message")) ? "error" : ""}
        />
        <Button.Group icon width="2" fluid>
          <Button
            color="orange"
            content="Add Reply"
            icon="edit"
            labelPosition="left"
            onClick={this.sendMessage}
          />
          <Button
            color="teal"
            content="Add File"
            icon="upload"
            labelPosition="left"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />  
      </Segment>
    );
  }
}

export default MessageForm;
