import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Header,
  Icon,
  Form,
  Button,
  Segment,
  Message
} from "semantic-ui-react";
import "./Register.css";
import firebase from "../../firebaseConfig";

class Registers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <Grid verticalAlign="middle" textAlign="center" className="heading">
        <Grid.Column className="register-box">
          <Header as="h2" icon color="red" textAlign="center">
            <Icon name="code" />
            Register for Dev Desk
            <Header.Subheader>
              Platform which user can use to chat and store notes.
            </Header.Subheader>
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                name="username"
                type="text"
                icon="user"
                iconPosition="left"
                placeholder="UserName"
                onChange={this.handleChange}
                value={username}
              />
              <Form.Input
                name="email"
                type="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                value={email}
              />
              <Form.Input
                name="password"
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
              />
              <Form.Input
                name="passwordConfirmation"
                type="password"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                value={passwordConfirmation}
              />
              <Button fluid type="submit" color="red">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user ? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Registers;
