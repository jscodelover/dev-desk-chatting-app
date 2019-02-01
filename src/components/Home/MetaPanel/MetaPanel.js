import React, { Component } from "react";
import moment from "moment";
import { Accordion, Icon, Header, Image } from "semantic-ui-react";

export default class MetaPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  creator = () => {
    const { otherUsers, user, channel } = this.props;
    let isCreator = otherUsers.find(u => u.userID === channel.createdBy);
    let creator = isCreator
      ? { name: isCreator.username, image: isCreator.picture }
      : { name: "You", image: user.picture };
    return (
      <Header as="h3">
        <Image circular src={creator.image} /> {creator.name}
      </Header>
    );
  };

  render() {
    const { activeIndex } = this.state;
    const { channel } = this.props;
    return (
      <Accordion styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          About Channel <Icon name="info circle" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>
            {channel.channelDetail}
            <br />
            Created On : {moment(channel.createdOn).format(" Do MMMM YYYY ")}
          </p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          All Users <Icon name="users" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p />
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Creator <Icon name="write" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          {this.creator()}
        </Accordion.Content>
      </Accordion>
    );
  }
}
