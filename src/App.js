import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Header from "./components/header/header.react";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import HomePage from "./pages/home-page/home-page.component";
import UserProfilePage from "./pages/user-profile-page/user-profile-page.component";
import MessagesPage from "./pages/messages-page/messages-page.component";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { setCurrentUser } from './redux/user/user.actions';

import User from "./classes/user/User";

import './App.css';

class App extends Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        // subscribe to this userRef for any change to this data
        // also get back the first state of the data
        userRef.onSnapshot(async (snapShot) => {
          // const {
          //   displayName,
          //   email,
          //   friend_array 
          // }
          //   = snapShot.data();
          const user_obj = new User(snapShot.id);
          const built_user_obj = await user_obj.build();
          setCurrentUser(
            built_user_obj
          );
        });
      }

      // when signing out, set the state to NULL
      else { setCurrentUser(null); }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="App" >
        <Header />
        {this.props.currentUser ? <div className="MainPage">
          <Switch>
            <Route
              exact
              path="/"
              component={HomePage}
            />

            <Route
              exact
              path="/messages"
              component={MessagesPage}
            />

            <Route
              path="/messages/target_uid=:target_uid"
              component={MessagesPage}
            />

            <Route
              path="/users/uid=:uid"
              component={UserProfilePage}
            />

            <Redirect
              to="/"
              component={HomePage}
            />
          </Switch>
        </div>
          : (
            <div className="MainPage">
              <SignInAndSignUpPage />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
