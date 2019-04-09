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
import "./Auth.css";
import firebase from "../../util/firebaseConfig";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(data => {
          // TODO: Add push to main page somewhere here. and save data to redux
          this.setState({ loading: false });
          this.props.history.push("/");
        })
        .catch(error => {
          console.log(error);
          this.setState({ error: [error.message], loading: false });
        });
    }
  };

  isFormValid = ({ email, password }) => {
    let err = [];
    if (!email.length || !password.length) {
      this.setState({ error: err.concat("Form is not fill") });
      return false;
    } else if (password.length < 6) {
      this.setState({
        error: err.concat("Password Should be more than 6 digits")
      });
      return false;
    }
    return true;
  };

  render() {
    const { email, password, loading, error } = this.state;
    return (
      <Grid verticalAlign="middle" textAlign="center" className="heading">
        <Grid.Column className="auth-box">
          <Header as="h1" icon color="teal" textAlign="center">
            <Icon name="code" />
            Login for DevDesk
            <Header.Subheader>
              Platform which user can use to chat and store notes.
            </Header.Subheader>
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
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
              <Button
                fluid
                type="submit"
                color="teal"
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
            Not a user ? <Link to="/register">Resgister</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
