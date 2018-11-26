import * as React from "react";
import { Segment, Button, Input, Icon } from "semantic-ui-react";
import firebase from '../../../firebaseConfig';

class MessageForm extends React.Component {
  constructor(props){
    super(props);
    this.state={
      message: '',
      loading: false,
      error: [],
    }
  }

  getMessage = (event) => {
    this.setState({[event.target.name]:event.target.value})
  }

  sendMessage = () => {
    const {messageRef, channelID, userID} = this.props;
    console.log(this.props)
    if(this.state.message){
      this.setState({loading: true});
      messageRef.child(channelID)
        .push()
        .set({
          content: this.state.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          userID: userID
        })
        .then(() => {
          console.log("data addded")
          this.setState({loading: false, message: ''});
        })
        .catch(() => {
            this.setState({loading: false, error: this.state.error.concat("message can't be send. Try Again !!")})
        })
    }
    else{
      this.setState({loading: false, error: this.state.error.concat("write the message")})
    }    
  }

  render() {
    const { message, error, loading } = this.state;
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
          className = {
            error.some(err => err.includes('message')) ? 'error' : ''
          }
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
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
