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
import firebase from "../../../util/firebaseConfig";

class ColorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      modal: false,
      sidebar: "rgba(168,79,168,1)"
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

  saveColor = () => {
    const { userRef, sidebar } = this.state;
    const { user } = this.props;
    userRef
      .child(`${user.userID}/color`)
      .update({ sidebar, theme: null })
      .then(() => {
        this.setState({ modal: false });
      });
  };

  saveTheme = (c1, c2, c3) => {
    const { userRef } = this.state;
    const { user } = this.props;
    userRef
      .child(`${user.userID}/color`)
      .update({ theme: [c1, c2, c3], sidebar: null });
  };

  defaultTheme = (color1, color2, color3) => (
    <React.Fragment>
      <Divider style={{ border: "none" }} />
      <div
        className="color-box"
        onClick={() => this.saveTheme(color1, color2, color3)}
      >
        <div className={`color-sidebar my${color1}`}>
          <div className={`color-replyBtn my${color2}`} />
          <div className={`color-fileBtn my${color3}`} />
        </div>
      </div>
    </React.Fragment>
  );

  render() {
    const { modal, sidebar } = this.state;
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
        {this.defaultTheme("voilet", "orange", "light-blue")}
        {this.defaultTheme("blue", "yellow", "red")}
        <Modal open={modal} basic size="small">
          <Header as="h2" content="Pick your theme" />
          <Modal.Content>
            <Header as="h4" content="SideBar" style={{ color: "white" }} />
            <Segment inverted style={{ background: sidebar }}>
              <ChromePicker
                color={sidebar}
                onChange={({ rgb }) => {
                  this.sidebarColorHandler(rgb);
                }}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" inverted onClick={this.saveColor}>
              <Icon name="checkmark" /> Save
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}
export default ColorPanel;
