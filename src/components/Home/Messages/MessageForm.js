import * as React from "react";
import uuidv4 from "uuid/v4";
import { Segment, Button, Input, Icon, Progress } from "semantic-ui-react";
import firebase from "../../../firebaseConfig";
import FileModal from "./FileModal";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageRef: firebase.storage().ref(),
      message: "",
      file: "",
      loading: false,
      error: [],
      modal: false,
      uploadTask: null,
      uploadStatus: "",
      uploadPercentage: 0
    };
  }

  getMessage = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (user, file) => {
    const messageObj = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        username: user.username,
        picture: user.picture,
        userID: user.userID
      }
    };
    if (file !== "") {
      messageObj["image"] = file;
      this.setState({ uploadStatus: "done" });
      return messageObj;
    }
    messageObj["content"] = this.state.message;
    return messageObj;
  };

  sendMessage = () => {
    const { messageRef, channel, user } = this.props;
    const { message, file, error } = this.state;

    if (message || file) {
      console.log(this.createMessage(user, file));
      this.setState({ loading: true });
      messageRef
        .child(channel.id)
        .push()
        .set(this.createMessage(user, file))
        .then(() => {
          this.setState({ loading: false, message: "", file: "" });
        })
        .catch(() => {
          this.setState({
            loading: false,
            error: error.concat("message can't be send. Try Again !!")
          });
        });
    } else {
      this.setState({
        loading: false,
        error: error.concat("write the message")
      });
    }
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  uploadFile = file => {
    const metaData = { contentType: file.type };
    const { storageRef } = this.state;
    const { channel } = this.props;
    this.setState(
      {
        uploadTask: storageRef
          .child(`${channel.channelName}/images/${uuidv4()}.jpg`)
          .put(file, metaData),
        uploadStatus: "uploading"
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snapshot => {
            let uploadPercentage = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ uploadPercentage });
          },
          error => {
            this.setState({ error: this.state.error.concat(error.message) });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                this.setState({ file: downloadURL });
                this.sendMessage(downloadURL);
              })
              .catch(err => {
                this.setState({ error: this.state.error.push(err) });
              });
          }
        );
      }
    );
  };

  render() {
    const {
      message,
      error,
      loading,
      modal,
      uploadStatus,
      uploadPercentage
    } = this.state;
    return (
      <Segment className="messageForm">
        {uploadStatus === "uploading" ? (
          <Progress
            style={{
              position: "fixed",
              top: "12%",
              left: "305px",
              right: "1rem"
            }}
            percent={uploadPercentage}
            inverted
            progress
            color="green"
          />
        ) : (
          ""
        )}
        <Input
          fluid
          style={{ marginBottom: "0.7rem" }}
          label={
            <Button icon>
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
