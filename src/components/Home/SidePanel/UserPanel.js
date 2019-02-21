import React, { Component } from "react";
import AvatarEditor from "react-avatar-editor";
import { Redirect } from "react-router-dom";
import {
  Header,
  Image,
  Icon,
  Dropdown,
  Grid,
  Modal,
  Button,
  Input
} from "semantic-ui-react";
import firebase from "../../../util/firebaseConfig";
import Spinner from "../../Spinner";

class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      image: "",
      croppedImage: "",
      userRef: firebase.database().ref("users"),
      storageRef: firebase.storage().ref(),
      blob: "",
      loading: false
    };
  }
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.props.user.username}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={this.modal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ];

  modal = () => {
    this.setState(prevState => {
      return { modal: !prevState.modal };
    });
  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase
          .database()
          .ref(`users/${this.props.user.userID}`)
          .set({
            ...this.props.user,
            lastSeen: firebase.database.ServerValue.TIMESTAMP,
            status: "offline"
          });
        /* eslint-disable no-unused-expressions */
        <Redirect to="/login" />;
      })
      .catch(function(error) {
        console.log("Can't LogOut. Try Again!!");
      });
  };

  selectedImage = event => {
    const file = event.target.files[0];
    this.setState({ image: file });
  };

  preview = () => {
    if (this.avatar) {
      this.avatar.getImageScaledToCanvas().toBlob(blob => {
        let imageURL = URL.createObjectURL(blob);
        this.setState({ croppedImage: imageURL, blob });
      });
    }
  };

  save = () => {
    const { storageRef, userRef, blob } = this.state;
    const { user } = this.props;
    storageRef
      .child(`${user.userID}/images-${user.userID}.jpg`)
      .put(blob, { contentType: "image/jpeg" })
      .then(snap => {
        this.setState({ loading: true });
        this.modal();
        snap.ref
          .getDownloadURL()
          .then(downloadURL => {
            userRef
              .child(user.userID)
              .update({ ...user, picture: downloadURL });
            this.setState({
              croppedImage: "",
              blob: "",
              image: "",
              loading: false
            });
          })
          .catch(err => {
            this.setState({
              croppedImage: "",
              blob: "",
              image: "",
              loading: false
            });
          });
      });
  };

  render() {
    const { modal, image, croppedImage, loading } = this.state;
    return (
      <React.Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <Grid>
            <Grid.Column>
              <Grid.Row style={{ padding: "1.2em" }}>
                <Header inverted as="h2">
                  <Icon name="code" />
                  <Header.Content>DevDesk</Header.Content>
                </Header>

                <Header
                  style={{ padding: "0.25em" }}
                  as="h3"
                  inverted
                  textAlign="center"
                >
                  <Dropdown
                    className="profile-dropdown "
                    trigger={
                      <div>
                        <Image
                          src={this.props.user.picture}
                          spaced="right"
                          avatar
                        />
                        <span>{this.props.user.username}</span>
                      </div>
                    }
                    options={this.dropdownOptions()}
                  />
                </Header>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        )}
        <Modal open={modal} basic>
          <Header content="Change Avatar" />
          <Modal.Content>
            <Input
              fluid
              label="choose a image"
              accept="image/*"
              type="file"
              onChange={this.selectedImage}
            />
            {image && (
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <AvatarEditor
                      ref={editor => (this.avatar = editor)}
                      image={image}
                      width={300}
                      height={300}
                      scale={1.2}
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Image
                      src={croppedImage}
                      size="small"
                      style={{ marginTop: "27%", marginLeft: "27%" }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" inverted onClick={this.modal}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" inverted onClick={this.preview}>
              <Icon name="image" /> Preview
            </Button>
            {croppedImage && (
              <Button color="green" inverted onClick={this.save}>
                <Icon name="image" /> Save
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default UserPanel;
