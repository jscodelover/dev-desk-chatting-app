import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Header, Image, Icon, Dropdown, Grid } from "semantic-ui-react";
import firebase from "../../../firebaseConfig";

class UserPanel extends Component {
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
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase
        .database()
        .ref(`users/${this.props.user.userID}`)
        .set({ ...this.props.user, lastSeen: firebase.database.ServerValue.TIMESTAMP, status: 'offline' });
        /* eslint-disable no-unused-expressions */
        <Redirect to="/login" />;
      })
      .catch(function(error) {
        console.log("Can't LogOut. Try Again!!");
      });
  };
  render() {
    return (
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
                trigger={
                  <span>
                    <Image
                      src={this.props.user.picture}
                      spaced="right"
                      avatar
                    />
                    {this.props.user.username}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
