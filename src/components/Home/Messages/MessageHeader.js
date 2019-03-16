import React from "react";
import moment from "moment";
import firebase from "../../../util/firebaseConfig";
import {
  Segment,
  Header,
  Icon,
  Input,
  Modal,
  Form,
  Button
} from "semantic-ui-react";

class MessageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRef: firebase.database().ref("users"),
      screenWidth: window.innerWidth,
      modal: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({ screenWidth: window.innerWidth });
    });
  }

  starredChannel = () => {
    const { activeChannelID, user } = this.props;
    const { userRef } = this.state;
    let prevStarred = user.starred ? user["starred"].split(",") : [];
    let index = prevStarred.findIndex(id => id === activeChannelID);
    if (index > -1) {
      prevStarred.splice(index, 1);
    } else {
      prevStarred.push(activeChannelID);
    }
    userRef.child(user.userID).set({ ...user, starred: prevStarred.join(",") });
  };

  handleChange = event => {
    this.props.searchMessage(event.target.value);
  };

  handleOpenModal = () => {
    this.setState({ modal: true });
  };
  handleCloseModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const {
      channelName,
      metaData,
      searchLoading,
      privateChannel,
      activeChannelID,
      user,
      showChannelInfo
    } = this.props;
    const { screenWidth, modal } = this.state;
    return (
      <Segment clearing className="messageHeader">
        <Header as="h2" floated="left" fluid="true" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            <Icon
              style={{ cursor: "pointer" }}
              name={
                user["starred"] && user["starred"].includes(activeChannelID)
                  ? "star"
                  : "star outline"
              }
              color={
                user["starred"] && user["starred"].includes(activeChannelID)
                  ? "yellow"
                  : "black"
              }
              onClick={this.starredChannel}
            />
          </span>
          <Header.Subheader>
            {privateChannel ? (
              metaData.status === "offline" ? (
                moment(metaData.lastSeen).format(" Do-MM-YY, ddd, h:mm a")
              ) : (
                <span>
                  {" "}
                  <Icon name="circle" color="green" /> Online
                </span>
              )
            ) : metaData.length > 1 ? (
              `${metaData.length} users`
            ) : (
              `${metaData.length} user`
            )}
          </Header.Subheader>
        </Header>
        <Header floated="right">
          {screenWidth > 678 ? (
            <Input
              size="mini"
              icon="search"
              name="searchTerm"
              onChange={this.handleChange}
              loading={searchLoading}
              placeholder="Search..."
            />
          ) : (
            <Icon
              name="search"
              color="grey"
              style={{ cursor: "pointer" }}
              onClick={this.handleOpenModal}
            />
          )}
          {!privateChannel && (
            <Icon
              name="info"
              color="grey"
              style={{ cursor: "pointer" }}
              onClick={showChannelInfo}
            />
          )}
        </Header>
        <Modal open={modal} basic onClose={this.handleCloseModal}>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  name="searchItem"
                  onChange={this.handleChange}
                  placeholder="Search..."
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleCloseModal}>
              <Icon name="checkmark" /> Done
            </Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  }
}

export default MessageHeader;
