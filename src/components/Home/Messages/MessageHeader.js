import React from "react";
import moment from "moment";
import firebase from "../../../firebaseConfig";
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInPersonalChat: {},
      userRef: firebase.database().ref("users"),
      isStarred: false
    };
  }

  componentDidUpdate(prevState) {
    const { userRef } = this.state;
    const { metaData } = this.props;
    if (typeof metaData === "string" && metaData !== prevState.metaData) {
      userRef.child(metaData).on("value", snap => {
        this.setState({ userInPersonalChat: snap.val() });
      });
    }
  }

  checkStarred = () => {
    this.setState(prevState => ({
      isStarred: !prevState.isStarred
    }));
  };

  starredChannel = () => {
    const { activeChannelID, user } = this.props;
    const { userRef } = this.state;
    let prevStarred = user.starred ? [user.starred] : [];
    prevStarred.push(activeChannelID);
    userRef.child(user.userID).set({ ...user, starred: prevStarred.join(",") });
  };

  handleChange = event => {
    this.props.searchMessage(event.target.value);
  };
  render() {
    const { channelName, metaData, searchLoading, privateChannel } = this.props;
    const { userInPersonalChat } = this.state;
    return (
      <Segment clearing className="messageHeader">
        <Header as="h2" floated="left" fluid="true" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            <Icon
              name={"star outline"}
              color="black"
              onClick={this.checkStarred}
            />
          </span>
          <Header.Subheader>
            {privateChannel ? (
              userInPersonalChat.status === "offline" ? (
                moment(userInPersonalChat.lastSeen).format(
                  " Do-MM-YY, ddd, h:mm a"
                )
              ) : (
                <span>
                  {" "}
                  <Icon name="circle" color="green" /> Online
                </span>
              )
            ) : metaData.length > 1 ? (
              `${metaData.length} users`
            ) : (
              `${metaData.length} user`
            )}
          </Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            onChange={this.handleChange}
            loading={searchLoading}
            placeholder="Search..."
          />
        </Header>
      </Segment>
    );
  }
}

export default MessageHeader;
