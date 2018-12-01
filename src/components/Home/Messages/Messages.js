import * as React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from "../../../firebaseConfig";
import Message from "./Message";
import "./Messages.css";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageRef: firebase.database().ref("messages"),
      messages: []
    };
  }

  componentDidMount() {
    const { messageRef } = this.state;
    const { channel } = this.props;
    let loadedMessage = [];
    messageRef.child(channel.id).on("child_added", snap => {
      loadedMessage.push(snap.val());
      this.setState({ messages: loadedMessage });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.channel.channelName !== this.props.channel.channelName) {
      const { messageRef } = this.state;
      const { channel } = this.props;
      let loadedMessage = [];
      messageRef.child(channel.id).on("child_added", snap => {
        loadedMessage.push(snap.val());
        console.log(loadedMessage);
        this.setState({ messages: loadedMessage });
      });
    }
  }

  displayMessages = (messages, user) =>
    messages.length > 0 &&
    messages.map(msg => {
      return <Message msg={msg} key={msg.timestamp} user={user} />;
    });

  render() {
    const { messageRef, messages } = this.state;
    const { channel, user } = this.props;
    return (
      <React.Fragment>
        <MessageHeader channelName={channel.channelName} />
        <Segment className="messages">
          <Comment.Group size="small">
            {this.displayMessages(messages, user)}
          </Comment.Group>
        </Segment>
        <MessageForm messageRef={messageRef} channel={channel} user={user} />
      </React.Fragment>
    );
  }
}

export default Messages;
