import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebase.utils";
import { connect } from "react-redux";

import "./header.styles.scss";

const Header = ({ currentUser }) => {
  return (
    <div className="header">
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            className="homeButton"
            color="inherit"
            aria-label="home"
            size="medium"
          >
            <Link to="/">
              <i class="fab fa-facebook fa-lg"></i>
            </Link>
            &nbsp;&nbsp;
            <Link to="/">
              <Typography variant="h5" className="title">
                Facebook
              </Typography>
            </Link>
          </IconButton>

          {currentUser && (
            <div className="options">
              {/* Welcome message */}
              <div className="option welcome">
                Welcome, {currentUser.getDisplayName()}
              </div>

              {/* Avatar */}
              {currentUser.getAvatarUrl() && (
                <IconButton
                  edge="end"
                  className="option"
                  color="inherit"
                  aria-label="option-sign-in"
                  size="medium"
                >
                  <Link to={`/users/uid=${currentUser.getUID()}`}>
                    <img src={currentUser.getAvatarUrl()} alt="avatar" />
                  </Link>
                </IconButton>
              )}

              {/* Messages */}
              <IconButton
                edge="end"
                className="option"
                color="inherit"
                aria-label="option-sign-in"
                size="medium"
              >
                {/* <Link to="/messages/target_uid=tp2bGkuzVUWfblVabRIIlPsLO2p1"> */}
                <Link to="/messages/">
                  <i class="fab fa-facebook-messenger fa-lg"></i>
                </Link>
              </IconButton>

              {/* Log out */}
              {currentUser && (
                <IconButton
                  edge="end"
                  className="option"
                  color="inherit"
                  aria-label="option-sign-out"
                  size="medium"
                  onClick={(event) => {
                    event.preventDefault();
                    auth.signOut();
                  }}
                >
                  <Link to="">
                    <i class="fas fa-sign-out-alt fa-lg"></i>
                  </Link>
                </IconButton>
              )}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(Header);
