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
      primary: "rgba(168,79,168,1)",
      secondary: "rgba(238,238,238,1)"
    };
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  primaryColorHandler = ({ r, g, b, a }) => {
    this.setState({ primary: `rgba(${r},${g},${b},${a})` });
  };

  secondaryColorHandler = ({ r, g, b, a }) => {
    this.setState({ secondary: `rgba(${r},${g},${b},${a})` });
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
          <Header as="h2" content="Pick your theme" />
          <Modal.Content>
            <Header
              as="h4"
              content="Primary Color"
              style={{ color: "white" }}
            />
            <Segment inverted style={{ background: primary }}>
              <ChromePicker
                color={primary}
                onChange={({ rgb }) => {
                  this.primaryColorHandler(rgb);
                }}
              />
            </Segment>
            <Header
              as="h4"
              content="Secondary Color"
              style={{ color: "white" }}
            />
            <Segment inverted style={{ background: secondary }}>
              <ChromePicker
                color={secondary}
                onChange={({ rgb }) => {
                  this.secondaryColorHandler(rgb);
                }}
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
