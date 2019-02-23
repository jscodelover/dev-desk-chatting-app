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
import { themes } from "../../../util/defaultThemeColor";
import firebase from "../../../util/firebaseConfig";

class ColorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      modal: false,
      sidebar: "",
      btn1: "",
      btn2: ""
    };
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  sidebarColorHandler = ({ r, g, b, a }) => {
    this.setState({
      sidebar: `rgba(${r},${g},${b},${a})`,
      btn1: `rgba(${r - 11},${g - 6},${b - 5},${0.8})`,
      btn2: `rgba(${r - 11},${g - 6},${b - 5},${0.9})`
    });
  };

  saveColor = () => {
    const { userRef, sidebar, btn1, btn2 } = this.state;
    const { user } = this.props;
    userRef
      .child(`${user.userID}/color`)
      .update({ theme: [sidebar, btn1, btn2] })
      .then(() => {
        this.setState({ modal: false });
      });
  };

  saveTheme = (c1, c2, c3) => {
    const { userRef } = this.state;
    const { user } = this.props;
    userRef.child(`${user.userID}/color`).update({ theme: [c1, c2, c3] });
  };

  defaultTheme = (color1, color2, color3) => (
    <React.Fragment key={color1}>
      {console.log(color1)}
      <Divider style={{ border: "none" }} />
      <div
        className="color-box"
        onClick={() => this.saveTheme(color1, color2, color3)}
      >
        <div className="color-sidebar" style={{ backgroundColor: color1 }}>
          <div className="color-replyBtn" style={{ backgroundColor: color2 }} />
          <div className="color-fileBtn" style={{ backgroundColor: color3 }} />
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
        style={{
          position: "fixed",
          right: 0
        }}
      >
        <Divider style={{ border: "none" }} />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {themes.map(theme => {
          let { sidebar, btn1, btn2 } = theme.colors;
          console.log(sidebar, btn1, btn2);
          return this.defaultTheme(sidebar, btn1, btn2);
        })}
        <Modal open={modal} basic size="small">
          <Header as="h2" content="Pick your theme" />
          <Modal.Content>
            <Header as="h4" content="SideBar" style={{ color: "white" }} />
            <Segment inverted style={{ background: sidebar }}>
              <SliderPicker
                styles={{ default: { wrap: {} } }}
                color="rgba(0, 0, 0, 0)"
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
