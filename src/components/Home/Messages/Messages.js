import * as React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from '../../../firebaseConfig';
import Message from './Message';
import "./Messages.css";

class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      messageRef : firebase.database().ref('messages'),
      channelID: this.props.channelID,
      userID: this.props.userID,
      messages: []
    }
  }

  componentDidMount(){
    const { messageRef, channelID } = this.state;
    let loadedMessage= [];
    messageRef.child(channelID).on('child_added', snap => {
        loadedMessage.push(snap.val());
        this.setState({messages: loadedMessage})
    })
  }

  displayMessages = (messages) => {
    messages && messages.map(msg => {
      return <Message msg={msg} />
    })
  }

  render() {
    const { messageRef, channelID, userID, messages } = this.state;
    console.log(messages)
    return (
      <React.Fragment>
        <MessageHeader />
        <Segment className="messages">
          <Comment.Group size="small">
            {this.displayMessages(messages)}
          </Comment.Group>  
        </Segment>
        <MessageForm messageRef={messageRef} channelID={channelID} userID={userID} />
      </React.Fragment>
    );
  }
}

export default Messages;
