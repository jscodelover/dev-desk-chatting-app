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
import { SliderPicker } from "react-color";

class ColorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sidebar: "rgba(168,79,168,1)",
      replyBtn: "rgba(242,113,28,1)",
      fileBtn: "rgba(69,182,174,1)"
    };
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  sidebarColorHandler = ({ r, g, b, a }) => {
    this.setState({ sidebar: `rgba(${r},${g},${b},${a})` });
  };

  replyBtnColorHandler = ({ r, g, b, a }) => {
    this.setState({ replyBtn: `rgba(${r},${g},${b},${a})` });
  };

  fileBtnColorHandler = ({ r, g, b, a }) => {
    this.setState({ fileBtn: `rgba(${r},${g},${b},${a})` });
  };

  render() {
    const { modal, sidebar, replyBtn, fileBtn } = this.state;
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
            <Header as="h4" content="SideBar" style={{ color: "white" }} />
            <Segment inverted style={{ background: sidebar }}>
              <SliderPicker
                styles={{ default: { wrap: {} } }}
                color={sidebar}
                onChange={({ rgb }) => {
                  this.sidebarColorHandler(rgb);
                }}
              />
            </Segment>
            <Header as="h4" content="Reply Button" style={{ color: "white" }} />
            <Segment inverted style={{ background: replyBtn }}>
              <SliderPicker
                styles={{ default: { wrap: {} } }}
                color={replyBtn}
                onChange={({ rgb }) => {
                  this.replyBtnColorHandler(rgb);
                }}
              />
            </Segment>
            <Header as="h4" content="File Button" style={{ color: "white" }} />
            <Segment inverted style={{ background: fileBtn }}>
              <SliderPicker
                styles={{ default: { wrap: {} } }}
                color={fileBtn}
                onChange={({ rgb }) => {
                  this.fileBtnColorHandler(rgb);
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
