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
      channel: this.props.channel,
      user: this.props.user,
      messages: []
    };
  }

  componentDidMount() {
    const { messageRef, channel } = this.state;
    let loadedMessage = [];
    messageRef.child(channel.id).on("child_added", snap => {
      loadedMessage.push(snap.val());
      this.setState({ messages: loadedMessage });
    });
  }

  displayMessages = messages =>
    messages &&
    messages.map(msg => {
      return <Message msg={msg} key={msg.timestamp} user={this.state.user} />;
    });

  render() {
    const { messageRef, channel, user, messages } = this.state;
    return (
      <React.Fragment>
        <MessageHeader />
        <Segment className="messages">
          <Comment.Group size="small">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messageRef={messageRef}
          channel={channel}
          user={user}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
