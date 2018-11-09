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
  componentDidMount() {
    console.log(this.props);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .once("value")
          .then(snapshot => {
            if (snapshot.val()) {
              this.props.history.push("/");
              this.props.setuser(snapshot.val());
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

const mapStateToProps = state => {
  return {
    loading: state.loading,
    isAuthenticated: state.isAuthenticated
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
