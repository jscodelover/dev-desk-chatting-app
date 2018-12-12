import React from "react";
import moment from 'moment';
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessageHeader extends React.Component {
  handleChange = event => {
    this.props.searchMessage(event.target.value);
  };
  render() {
    const { channelName, usersInChannel, searchLoading, privateChannel, user } = this.props;
    return (
      <Segment clearing className="messageHeader">
        <Header as="h2" floated="left" fluid="true" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {privateChannel ? (
              <Icon name="user" color="black" />
            ) : (
              <Icon name={"star outline"} color="black" />
            )}
          </span>
          <Header.Subheader>
            {privateChannel ? 
              user.status === 'offline' ? 
                moment(user.lastSeen).format(" Do-MM-YY, ddd, h:mm:ss a") : 
                <span> <Icon name="circle" color="green" /> Online</span>  
            :
              usersInChannel.length > 1? 
              `${usersInChannel.length} users`
              : `${usersInChannel.length} user`}
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
