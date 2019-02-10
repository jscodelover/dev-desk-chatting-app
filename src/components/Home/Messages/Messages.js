import * as React from "react";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import firebase from "../../../util/firebaseConfig";
import Message from "./Message";
import { setUsersInChannel, setShowChannelInfo } from "../../../store/action";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageRef: firebase.database().ref("messages"),
      userRef: firebase.database().ref("users"),
      typingRef: firebase.database().ref("typing"),
      typingUsers: [],
      messages: [],
      channelUsers: [],
      searchMsg: [],
      searchLoading: false,
      msgLoading: true,
      userInHeader: {}
    };
  }

  componentDidMount() {
    this.fetchMessage();
    this.findTypingUsers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channel.channelName !== this.props.channel.channelName) {
      clearTimeout(this.time);
      this.fetchMessage();
      this.findTypingUsers();
    }
  }

  fetchMessage = () => {
    const { messageRef } = this.state;
    const { channel, channelIDs } = this.props;
    let loadedMessage = [];
    messageRef.once("value", snap => {
      this.setState({ msgLoading: true });
      if (snap.hasChild(channel.id)) {
        messageRef.child(channel.id).on("child_added", snapMsg => {
          loadedMessage.push({
            ...snapMsg.val()
          });
          this.setState({ messages: loadedMessage });
          if (channelIDs.includes(channel.id)) this.userCount(loadedMessage);
          else this.props.setUsersInChannel([]);
        });
      } else {
        this.setState({ messages: [] });
        if (channelIDs.includes(channel.id)) this.userCount(loadedMessage);
        else this.props.setUsersInChannel([]);
      }
      this.setState({ msgLoading: false });
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

  render() {
    const {
      messageRef,
      messages,
      searchMsg,
      searchLoading,
      msgLoading,
      typingUsers
    } = this.state;
    const {
      channel,
      user,
      privateChannel,
      activeChannelID,
      setShowChannelInfo,
      otherUsers
    } = this.props;
    return (
      <React.Fragment>
        {msgLoading ? (
          <p>Loading</p>
        ) : (
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
              showChannelInfo={() => {
                setShowChannelInfo(true);
              }}
            />
            <Segment className="messages" loading={msgLoading}>
              <Comment.Group size="large">
                {searchMsg.length > 0
                  ? this.displayMessages(searchMsg, user, otherUsers)
                  : this.displayMessages(messages, user, otherUsers)}
              </Comment.Group>
            </Segment>
          </React.Fragment>
        )}
        <MessageForm
          messageRef={messageRef}
          channel={channel}
          user={user}
          typingUsers={typingUsers}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    otherUsers: user.otherUsers,
    channel: channel.currentChannel,
    activeChannelID: channel.activeChannelID,
    channelIDs: channel.channelIDs,
    privateChannel: channel.privateChannel,
    usersInChannel: channel.usersInChannel
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUsersInChannel: payload => dispatch(setUsersInChannel(payload)),
    setShowChannelInfo: payload => dispatch(setShowChannelInfo(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
