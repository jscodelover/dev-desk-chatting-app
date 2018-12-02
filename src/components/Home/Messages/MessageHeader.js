import React from "react";
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessageHeader extends React.Component {
  handleChange = event => {
    this.props.searchMessage(event.target.value);
  };
  render() {
    const { channelName, usersInChannel, searchLoading } = this.props;
    return (
      <Segment clearing>
        <Header as="h2" floated="left" fluid="true" style={{ marginBottom: 0 }}>
          <span>
            {channelName} <Icon name={"star outline"} color="black" />
          </span>
          <Header.Subheader>
            {usersInChannel.length > 1
              ? `${usersInChannel.length} users`
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
