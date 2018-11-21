import * as React from "react";
import { Segment, Button, Input, Icon } from "semantic-ui-react";

class MessageForm extends React.Component {
  render() {
    return (
      <Segment className="messageForm">
        <Input
          fluid
          label={
            <Button icon>
              {" "}
              <Icon name="add" />
            </Button>
          }
          labelPosition="left"
          placeholder="Add Message..."
        />
        <Button.Group fluid>
          <Button
            color="orange"
            content="Add Reply"
            icon="edit"
            labelPosition="left"
          />
          <Button
            color="teal"
            content="Add File"
            icon="upload"
            labelPosition="left"
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
