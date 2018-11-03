import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import firebase from "firebase";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home/Home";
import "./App.css";

class App extends Component {
  componentDidMount() {
    console.log(this.props);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
      }
    });
  }
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

export default withRouter(App);
