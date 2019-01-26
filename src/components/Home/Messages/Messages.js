import * as React from "react";
import { connect } from "react-redux";
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
      userRef: firebase.database().ref("users"),
      messages: [],
      usersInChannel: [],
      searchMsg: [],
      searchLoading: false,
      msgLoading: true,
      userInHeader: {}
    };
  }

  componentDidMount() {
    this.fetchMessage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channel.channelName !== this.props.channel.channelName) {
      clearTimeout(this.time);
      this.fetchMessage();
    }
  }

  fetchMessage = () => {
    const { messageRef, userRef } = this.state;
    const { channel } = this.props;
    let loadedMessage = [];
    messageRef.once("value", snap => {
      this.setState({ msgLoading: true });
      if (snap.hasChild(channel.id)) {
        messageRef.child(channel.id).on("child_added", snapMsg => {
          userRef.child(snapMsg.val().userID).once("value", snapUser => {
            loadedMessage.push({
              ...snapMsg.val(),
              user: { ...snapUser.val() }
            });
            this.setState({ messages: loadedMessage });
            this.userCount(loadedMessage);
          });
        });
      } else {
        this.setState({ messages: [] });
        this.userCount(loadedMessage);
      }
      this.setState({ msgLoading: false });
    });
  };

  userCount = messages => {
    if (messages.length) {
      let users = messages.reduce((userArray, msg) => {
        if (!userArray.includes(msg.user.username))
          return userArray.concat(msg.user.username);
        return userArray;
      }, []);
      this.setState({ usersInChannel: users });
    } else {
      this.setState({ usersInChannel: [] });
    }
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

  metaData = () => {
    const { channelIDs, channel, user } = this.props;
    const { usersInChannel } = this.state;
    if (channelIDs.includes(channel.id)) {
      return usersInChannel;
    } else {
      const { userID } = user;
      const regxExp = new RegExp(userID, "gi");
      return channel["id"].replace(regxExp, "");
    }
  };

  render() {
    const {
      messageRef,
      messages,
      searchMsg,
      searchLoading,
      msgLoading
    } = this.state;
    const { channel, user, privateChannel, activeChannelID } = this.props;
    return (
      <React.Fragment>
        <MessageHeader
          channelName={channel.channelName}
          metaData={this.metaData()}
          searchMessage={data => {
            this.searchMessage(data);
          }}
          user={user}
          activeChannelID={activeChannelID}
          searchLoading={searchLoading}
          privateChannel={privateChannel}
        />
        <Segment className="messages" loading={msgLoading}>
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

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    channel: channel.currentChannel,
    activeChannelID: channel.activeChannelID,
    channelIDs: channel.channelIDs,
    privateChannel: channel.privateChannel
  };
};

export default connect(mapStateToProps)(Messages);
