import * as React from "react";
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input, Icon } from "semantic-ui-react";
import firebase from "../../../firebaseConfig";
import FileModal from "./FileModal";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      storageRef: firebase.storage().ref(),
      message: "",
      loading: false,
      error: [],
      modal: false,
      uploadTask: null,
      uploadStatus: '',
      uploadPercentage: 0
    };
  }

  getMessage = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  sendMessage = () => {
    const { messageRef, channel, user } = this.props;
    if (this.state.message) {
      this.setState({ loading: true });
      messageRef
        .child(channel.id)
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
    const metaData = { contentType: file.type };
    const { storageRef } = this.state;
    const { channel } = this.props;

    this.setState({ 
        uploadTask: storageRef.child(`${channel.name}/images/${uuidv4}`).put(file,metaData), 
        uploadStatus: "uploading"
      },
      () => {
        this.state.uploadTask.on('state_changed', snapshot => {
          let uploadPercentage = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
          this.setState({uploadPercentage});
        }, error => {
          this.setState({error: this.state.error.concat(error.message)})
        }, () => {
          this.state.uploadTask.snapshot.ref.getDownloadURL().then( (downloadURL) => {
            console.log('File available at', downloadURL);
          });
        });
      } 
    );
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
