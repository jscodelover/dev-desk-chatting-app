import * as React from "react";
import { connect } from 'react-redux';
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
      presenceRef: firebase.database().ref("presence"),
      messages: [],
      usersInChannel: [],
      searchMsg: [],
      searchLoading: false
    };
  }

  componentDidMount() {
    this.fetchMessage();
  }

  //TODO: when we include personal user chat -> Edit userCount.
  componentDidUpdate(prevProps) {
    if (prevProps.channel.channelName !== this.props.channel.channelName) {
      this.fetchMessage();
    }
  }

  fetchMessage = () => {
    const { messageRef } = this.state;
    const { channel } = this.props;
    let loadedMessage = [];
    messageRef.child(channel.id).on("child_added", snap => {
      loadedMessage.push(snap.val());
      this.setState({ messages: loadedMessage });
      this.userCount(loadedMessage);
    });
  };

  userCount = messages => {
    let users = messages.reduce((userArray, msg) => {
      if (!userArray.includes(msg.user.username))
        return userArray.concat(msg.user.username);
      return userArray;
    }, []);
    this.setState({ usersInChannel: users });
  };

  displayMessages = (messages, user) =>
    messages.length > 0 &&
    messages.map(msg => {
      return <Message msg={msg} key={msg.timestamp} user={user} />;
    });

  //TODO: include search on complete message database --> (using channelIDs for this)
  searchMessage = searchInput => {
    const { messages } = this.state;
    let regxExp = new RegExp(searchInput, "gi");
    this.setState({ searchLoading: true });
    let searchMsg = messages.reduce((acc, msg) => {
      if (
        (msg.hasOwnProperty("content") && msg["content"].match(regxExp)) ||
        msg.user.username.match(regxExp)
      ) {
        acc.push(msg);
      }
      return acc;
    }, []);
    this.setState({ searchMsg });
    setTimeout(() => {
      this.setState({ searchLoading: false });
    }, 1000);
  };

  // channelStatus = () => {
  //   if(this.props.privateChannel){
  //     let status = 'offline'
  //     this.state.presenceRef.child(this.props.channel.user.userID).on("child_changed", snap => {
  //       status = 'online'
  //     });
  //     return status;
  //   }
  //  return ;
  // }

  render() {
    const {
      messageRef,
      messages,
      usersInChannel,
      searchMsg,
      searchLoading,
    } = this.state;
    const { channel, user, privateChannel } = this.props;
    return (
      <React.Fragment>
        <MessageHeader
          channelName={channel.channelName}
          user= {channel.user}
          usersInChannel={usersInChannel}
          searchMessage={data => {
            this.searchMessage(data);
          }}
          searchLoading={searchLoading}
          privateChannel={privateChannel}
        />
        <Segment className="messages">
          <Comment.Group size="large">
            {searchMsg.length > 0
              ? this.displayMessages(searchMsg, user)
              : this.displayMessages(messages, user)}
          </Comment.Group>
        </Segment>
        <MessageForm messageRef={messageRef} channel={channel} user={user} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({user, channel}) => {
  return{
    user: user.currentUser,
    channel: channel.currentChannel,
    channelIDs: channel.channelIDs,
    privateChannel: channel.privateChannel
  }
}

export default connect(mapStateToProps)(Messages);
