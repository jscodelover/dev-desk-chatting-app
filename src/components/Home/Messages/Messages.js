import * as React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import './Messages.css';

class Messages extends React.Component{
  render(){
    return(
      <React.Fragment>
        <MessageHeader className="messageHeader" />
        <Segment className="messages">
          <Comment.Group fluid>
          </Comment.Group>
        </Segment>
        <MessageForm />
      </React.Fragment>
    );
  }
}

export default Messages;