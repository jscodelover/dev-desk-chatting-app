import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import firebase from "firebase";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./Home/Home";
import Spinner from "./Spinner";
import { setUser, clearUser } from "../store/action";
import "./App.css";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionRef: firebase.database().ref(".info/connected"),
      persence: firebase.database().ref("presence")
    };
  }

  setStatus = user => {
    const { connectionRef, persence } = this.state;
    connectionRef.on("value", snap => {
      if (snap.val()) {
        let status = persence.child(user.userID);
        status.set(true);
        status.onDisconnect().remove();
        firebase
          .database()
          .ref(`users/${user.userID}`)
          .onDisconnect()
          .set({
            ...user,
            lastSeen: firebase.database.ServerValue.TIMESTAMP,
            status: "offline"
          });
      }
    });

    persence.on("child_added", snap => {
      if (user.userID === snap.key) {
        this.addStatus(user);
      }
    });
  };

  addStatus = (user, connected = true) => {
    firebase
      .database()
      .ref(`users/${user.userID}`)
      .set({ ...user, status: "online", lastSeen: "" });
  };

  componentDidMount() {
    console.log("checkAUth");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .on("value", snapshot => {
            if (snapshot.val()) {
              this.setStatus(snapshot.val());
              this.props.setuser(snapshot.val());
              this.props.history.push("/");
            } else {
              this.props.history.push("/login");
            }
          });
      } else {
        this.props.clearuser();
        this.props.history.push("/login");
      }
    });
  }
  render() {
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute
          exact
          path="/"
          component={Home}
          isAuthenticated={this.props.isAuthenticated}
        />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    loading: user.loading,
    isAuthenticated: user.isAuthenticated
  };
};

const mapDisptachToProps = disptach => {
  return {
    setuser: data => disptach(setUser(data)),
    clearuser: () => disptach(clearUser())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDisptachToProps
  )(App)
);
