import React, { Component } from "react";
import { Accordion, Icon } from "semantic-ui-react";

export default class MetaPanel extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <Accordion styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          About Channel
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>sample</p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          All Users
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>sample</p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          Creator
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>sample</p>
        </Accordion.Content>
      </Accordion>
    );
  }
}
