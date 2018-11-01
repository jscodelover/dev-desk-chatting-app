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
      passwordConfirmation: "",
      loading: false,
      error: []
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  displayError = error => error.map((err, i) => <p key={i}>{err}</p>);

  errorHighlighter = (error, name) =>
    error.some(err => err.toLowerCase().includes(name));

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ loading: true, error: [] });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(data => {
          console.log(data);
          this.setState({ loading: false });
        })
        .catch(error => {
          console.log(error);
          this.setState({ error: [error.message], loading: false });
        });
    }
  };

  isFormValid = ({
    username,
    email,
    password,
    passwordConfirmation,
    error
  }) => {
    let err = [];
    if (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    ) {
      this.setState({ error: err.concat("Form is not fill") });
      return false;
    } else if (password.length < 6 || passwordConfirmation.length < 6) {
      this.setState({
        error: err.concat("Password Should be more than 6 digits")
      });
      return false;
    } else if (password !== passwordConfirmation) {
      this.setState({ error: err.concat("Password does not match") });
      return false;
    }
    return true;
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      loading,
      error
    } = this.state;
    return (
      <Grid verticalAlign="middle" textAlign="center" className="heading">
        <Grid.Column className="register-box">
          <Header as="h1" icon color="red" textAlign="center">
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
                className={this.errorHighlighter(error, "email") ? "error" : ""}
              />
              <Form.Input
                name="password"
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password (with min 6 digit)"
                onChange={this.handleChange}
                value={password}
                className={
                  this.errorHighlighter(error, "password") ? "error" : ""
                }
              />
              <Form.Input
                name="passwordConfirmation"
                type="password"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={
                  this.errorHighlighter(error, "password") ? "error" : ""
                }
              />
              <Button
                fluid
                type="submit"
                color="red"
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                Submit
              </Button>
            </Segment>
            {error.length > 0 && (
              <Message negative>
                <Message.Header>Error</Message.Header>
                {this.displayError(error)}
              </Message>
            )}
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
