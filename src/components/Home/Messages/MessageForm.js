import * as React from "react";
import uuidv4 from "uuid/v4";
import { Segment, Button, Input, Progress } from "semantic-ui-react";
import firebase from "../../../util/firebaseConfig";
import FileModal from "./FileModal";
import Typing from "./Typing";
import * as typeFn from "../../../util/typingfn";
import * as session from "../../../util/sessionData";
import Emoji from "./Emoji";

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
      uploadPercentage: 0,
      cursorPos: 0
    };
  }

  componentDidMount() {
    this.getStoragedData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channel.channelName !== this.props.channel.channelName)
      this.getStoragedData();
  }

  getStoragedData() {
    if (session.getSessionData(this.props.channel.id))
      this.setState({ message: session.getSessionData(this.props.channel.id) });
    else this.setState({ message: "" });
  }

  getMessage = event => {
    this.setState({ [event.target.name]: event.target.value });
    typeFn.typingAdd(event.target.value, this.props.channel, this.props.user);
    if (event.target.value)
      session.addSessionData(this.props.channel.id, event.target.value);
    else session.removeSessionData(this.props.channel.id);

    this.setState({ cursorPos: event.target.selectionStart });
  };

  createMessage = user => {
    const { file, message } = this.state;
    const messageObj = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userID: user.userID
    };
    if (file !== "") {
      messageObj["image"] = file;
    } else {
      messageObj["content"] = message;
    }
    return messageObj;
  };

  sendMessage = () => {
    const { messageRef, channel, user } = this.props;
    const { message, error } = this.state;

    if (message) {
      this.setState({ loading: true });
      messageRef
        .child(channel.id)
        .push()
        .set(this.createMessage(user))
        .then(() => {
          this.setState({ loading: false, message: "", error: [] });
          typeFn.typingRemove(channel, user);
          session.removeSessionData(channel.id);
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

  sendFileMessage = pathToUpload => {
    const { messageRef, user } = this.props;
    const { error } = this.state;

    messageRef
      .child(pathToUpload.id)
      .push()
      .set(this.createMessage(user))
      .then(() => {
        this.setState({
          file: "",
          uploadStatus: "done",
          error: []
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          uploadStatus: "fail",
          error: error.concat(
            " Error in Uploading file in Database. Try Again!! "
          )
        });
      });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  uploadFile = file => {
    const pathToUpload = this.props.channel;
    const metaData = { contentType: file.type };
    const { storageRef } = this.state;

    this.setState(
      {
        uploadTask: storageRef
          .child(`${pathToUpload.channelName}/images/${uuidv4()}.jpg`)
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
            this.setState({
              error: this.state.error.concat(error.message),
              uploadTask: "",
              uploadStatus: "fail"
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                this.setState({ file: downloadURL, uploadTask: "" });
                this.sendFileMessage(pathToUpload);
              })
              .catch(err => {
                this.setState({
                  error: this.state.error.push(err),
                  uploadTask: "",
                  uploadStatus: "fail"
                });
              });
          }
        );
      }
    );
  };

  addEmoji = emoji => {
    const { message, cursorPos } = this.state;
    const part1 = message.slice(0, cursorPos);
    const part2 = message.slice(cursorPos);
    this.setState({ message: `${part1}${emoji}${part2}` });
  };

  handleCommand = event => {
    if (event.ctrlKey && event.key === "Enter") this.sendMessage();
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
    const { user, typingUsers } = this.props;
    const btn1 = user.color.sidebar
      ? "rgba(0, 0, 0, 0.8)"
      : user.color.theme[1];
    const btn2 = user.color.sidebar
      ? "rgba(0, 0, 0, 0.8)"
      : user.color.theme[2];
    return (
      <Segment
        className={
          typingUsers.length ? "messageForm typingSpace" : "messageForm"
        }
      >
        {typingUsers.length ? <Typing typingUsers={typingUsers} /> : null}
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
            <Emoji
              onSelect={emoji => {
                this.addEmoji(emoji);
              }}
            />
          }
          onClick={this.getMessage}
          onKeyDown={this.handleCommand}
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
            style={{ backgroundColor: btn1 }}
            color="orange"
            content="Add Reply"
            disabled={loading}
            icon="edit"
            labelPosition="left"
            onClick={this.sendMessage}
          />
          <Button
            style={{ backgroundColor: btn2 }}
            color="teal"
            content="Add File"
            disabled={uploadStatus === "uploading"}
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
