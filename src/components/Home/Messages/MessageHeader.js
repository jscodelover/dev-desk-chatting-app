import React from "react";
import moment from "moment";
import firebase from "../../../util/firebaseConfig";
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users")
    };
  }

  starredChannel = () => {
    const { activeChannelID, user } = this.props;
    const { userRef } = this.state;
    let prevStarred = user.starred ? user["starred"].split(",") : [];
    let index = prevStarred.findIndex(id => id === activeChannelID);
    if (index > -1) {
      prevStarred.splice(index, 1);
    } else {
      prevStarred.push(activeChannelID);
    }
    userRef.child(user.userID).set({ ...user, starred: prevStarred.join(",") });
  };

  handleChange = event => {
    this.props.searchMessage(event.target.value);
  };

  render() {
    const {
      channelName,
      metaData,
      searchLoading,
      privateChannel,
      activeChannelID,
      user,
      showChannelInfo
    } = this.props;
    return (
      <Segment clearing className="messageHeader">
        <Header as="h2" floated="left" fluid="true" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            <Icon
              style={{ cursor: "pointer" }}
              name={
                user["starred"] && user["starred"].includes(activeChannelID)
                  ? "star"
                  : "star outline"
              }
              color={
                user["starred"] && user["starred"].includes(activeChannelID)
                  ? "yellow"
                  : "black"
              }
              onClick={this.starredChannel}
            />
          </span>
          <Header.Subheader>
            {privateChannel ? (
              metaData.status === "offline" ? (
                moment(metaData.lastSeen).format(" Do-MM-YY, ddd, h:mm a")
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
          {!privateChannel && (
            <Icon
              name="info"
              color="grey"
              style={{ cursor: "pointer" }}
              onClick={showChannelInfo}
            />
          )}
        </Header>
      </Segment>
    );
  }
}

export default MessageHeader;
