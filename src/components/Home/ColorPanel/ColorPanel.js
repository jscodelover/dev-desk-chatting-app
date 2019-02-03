import React from "react";
import {
  Menu,
  Sidebar,
  Button,
  Divider,
  Modal,
  Header,
  Icon,
  Segment
} from "semantic-ui-react";
import { ChromePicker } from "react-color";

class ColorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      primary: "#4c3c4c",
      secondary: "#eeeeee"
    };
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  primaryColorHandler = color => {
    this.setState({ primary: color.hex });
  };

  secondaryColorHandler = color => {
    this.setState({ secondary: color.hex });
  };

  render() {
    const { modal, primary, secondary } = this.state;
    return (
      <Sidebar
        as={Menu}
        width="very thin"
        inverted
        vertical
        visible
        icon="labeled"
      >
        <Divider style={{ border: "none" }} />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        <Modal open={modal} basic size="small">
          <Header content="Pick your theme" />
          <Modal.Content>
            <Segment inverted style={{ background: primary }}>
              <Header as="h3" content="Primary Color" />
              <ChromePicker
                color={primary}
                onChange={this.primaryColorHandler}
              />
            </Segment>
            <Segment inverted style={{ background: secondary }}>
              <Header as="h3" content="Secondary Color" />
              <ChromePicker
                color={secondary}
                onChange={this.secondaryColorHandler}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" inverted>
              <Icon name="checkmark" /> Save
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}
export default ColorPanel;
