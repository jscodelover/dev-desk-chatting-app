import * as React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from '../../../firebaseConfig';
import "./Messages.css";

class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messageRef : firebase.database().ref('messages'),
    }
  }
  render() {
    const { messageRef } = this.state;
    const { channelID, userID } = this.props;
    return (
      <React.Fragment>
        <MessageHeader />
        <Segment className="messages">
          <Comment.Group />
        </Segment>
        <MessageForm messageRef={messageRef} channelID={channelID} userID={userID} />
      </React.Fragment>
    );
  }
}

export default Messages;
