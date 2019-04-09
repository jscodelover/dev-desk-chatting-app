import * as React from "react";
import { connect } from "react-redux";
import { Segment, Comment, Loader } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from "../../../util/firebaseConfig";
import Message from "./Message";
import {
  setUsersInChannel,
  setShowChannelInfo,
  setMessages
} from "../../../store/action";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageRef: firebase.database().ref("messages"),
      userRef: firebase.database().ref("users"),
      typingRef: firebase.database().ref("typing"),
      typingUsers: [],
      channelUsers: [],
      reachedDBEnd: false,
      searchMsg: [],
      searchLoading: false,
      userInHeader: {},
      hasSearchData: false,
      connectionRef: firebase.database().ref(".info/connected")
    };
  }

  componentDidMount() {
    this.scrollToBottom();
    this.fetchMessage();
    this.findTypingUsers();
    this.state.connectionRef.on("value", snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(this.props.channel.id)
          .child(this.props.user.userID)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  }

  componentDidUpdate(prevProps) {
    this.scrollToBottom();
    if (prevProps.channel.channelName !== this.props.channel.channelName) {
      this.setState({ reachedDBEnd: false });
      clearTimeout(this.time);
      this.fetchMessage();
      this.findTypingUsers();
    }
  }

  scrollToBottom = () => {
    if (this.scrollRef) this.scrollRef.scrollIntoView({ behavior: "smooth" });
  };

  componentWillUnmount() {
    const { typingRef, connectionRef, messageRef } = this.state;
    const { channel } = this.props;
    typingRef.child(channel.id).off();
    connectionRef.off();
    messageRef.child(channel.id).off();
  }

  fetchMessage = () => {
    const { messageRef } = this.state;
    const { channel, channelIDs } = this.props;
    let loadedMessage = [];
    messageRef.once("value", snap => {
      if (snap.hasChild(channel.id)) {
        messageRef.child(channel.id).on("child_added", snapMsg => {
          loadedMessage.push({
            ...snapMsg.val()
          });
          if (channelIDs.includes(channel.id)) this.userCount(loadedMessage);
          else this.props.setUsersInChannel([]);
        });
      } else {
        this.props.setMessages([]);
        if (channelIDs.includes(channel.id)) this.userCount(loadedMessage);
        else this.props.setUsersInChannel([]);
      }
      this.setState({ reachedDBEnd: true });
      this.props.setMessages(loadedMessage);
    });
  };

  userCount = messages => {
    const allUser = [...this.props.otherUsers, this.props.user];
    if (messages.length) {
      let users = messages.reduce((userArray, msg) => {
        let msgUser = allUser.find(u => u.userID === msg.userID);
        if (userArray.findIndex(obj => obj.name === msgUser.username) < 0)
          return userArray.concat({
            name: msgUser.username,
            image: msgUser.picture
          });
        return userArray;
      }, []);
      this.props.setUsersInChannel(users);
    } else {
      this.props.setUsersInChannel([]);
    }
  };

  findTypingUsers = () => {
    const { typingRef } = this.state;
    const { channel, user } = this.props;
    typingRef.child(channel.id).on("value", snap => {
      let typerArray = [];
      for (let u in snap.val()) {
        if (user.userID !== u) typerArray.push(snap.val()[u]);
      }
      this.setState({ typingUsers: typerArray });
    });
  };

  displayMessages = (messages, user, otherUsers) =>
    messages.length > 0 &&
    messages.map(msg => {
      return (
        <Message
          msg={msg}
          key={msg.timestamp}
          user={user}
          allUsers={[...otherUsers, user]}
        />
      );
    });

  //TODO: include search on complete message database --> (using channelIDs for this)
  searchMessage = searchInput => {
    const { messages, user, otherUsers } = this.props;
    const allUsers = [user, ...otherUsers];
    let regxExp = new RegExp(searchInput, "gi");
    const userSearched = allUsers.find(u => Boolean(u.username.match(regxExp)));
    console.log(userSearched);
    this.setState({ searchLoading: true });

    let searchMsg = messages.reduce((acc, msg) => {
      if (
        (msg.hasOwnProperty("content") && msg["content"].match(regxExp)) ||
        (userSearched && msg.userID === userSearched.userID)
      ) {
        acc.push(msg);
      }
      return acc;
    }, []);
    this.setState({ searchMsg, hasSearchData: !!searchInput });
    setTimeout(() => {
      this.setState({ searchLoading: false });
    }, 1000);
  };

  metaData = () => {
    const {
      channelIDs,
      channel,
      user,
      otherUsers,
      usersInChannel
    } = this.props;
    if (channelIDs.includes(channel.id)) {
      return usersInChannel;
    } else {
      const { userID } = user;
      const regxExp = new RegExp(userID, "gi");
      let id = channel["id"].replace(regxExp, "");
      let index = otherUsers.findIndex(user => user.userID === id);
      return { ...otherUsers[index] };
    }
  };

  clearSearchData = () => {
    this.setState({ hasSearchData: false, searchMsg: [] });
  };

  render() {
    const {
      messageRef,
      searchMsg,
      searchLoading,
      typingUsers,
      inputValue,
      reachedDBEnd,
      hasSearchData
    } = this.state;
    const {
      channel,
      user,
      privateChannel,
      activeChannelID,
      setShowChannelInfo,
      otherUsers,
      messages
    } = this.props;
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
          hasSearchData={hasSearchData}
          privateChannel={privateChannel}
          showChannelInfo={() => {
            setShowChannelInfo(true);
          }}
          clearSearchData={this.clearSearchData}
        />
        <Segment className="messages">
          {messages.length || reachedDBEnd ? (
            <React.Fragment>
              <Comment.Group size="large">
                {hasSearchData
                  ? this.displayMessages(searchMsg, user, otherUsers)
                  : this.displayMessages(messages, user, otherUsers)}
              </Comment.Group>
              <div
                ref={scroll => {
                  this.scrollRef = scroll;
                }}
              />
            </React.Fragment>
          ) : (
            <Loader active>Loading Messages....</Loader>
          )}
        </Segment>
        <MessageForm
          messageRef={messageRef}
          inputValue={inputValue}
          channel={channel}
          user={user}
          typingUsers={typingUsers}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user, channel, messages }) => {
  return {
    user: user.currentUser,
    otherUsers: user.otherUsers,
    channel: channel.currentChannel,
    activeChannelID: channel.activeChannelID,
    channelIDs: channel.channelIDs,
    privateChannel: channel.privateChannel,
    usersInChannel: channel.usersInChannel,
    messages: messages.messages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUsersInChannel: payload => dispatch(setUsersInChannel(payload)),
    setShowChannelInfo: payload => dispatch(setShowChannelInfo(payload)),
    setMessages: payload => dispatch(setMessages(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
