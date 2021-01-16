import React from "react";
import { connect } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";
import { setCurrentUser } from "../../redux/user/user.actions";

import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";

import User from "../../classes/User/User";

const PublicityPopover = ({
  currentUser,
  postPublicity,
  setPostPublicity,
  handlePopoverOpen,
  handlePopoverClose,
  popoverAnchorElement,
}) => {
  const publicityDict = {
    public: (
      <>
        <i class="fas fa-globe-americas"></i>&nbsp;Everyone can see this post.
      </>
    ),
    friends: (
      <>
        <i class="fas fa-user-friends"></i>&nbsp;Only friends can see this post.
      </>
    ),
    mentioned: (
      <>
        <i class="fas fa-at"></i>&nbsp;Only people you mention can see this
        post.
      </>
    ),
    private: (
      <>
        <i class="fas fa-lock"></i>&nbsp;Only you can see this post.
      </>
    ),
  };

  const updateUserPostPublicity = async (preference) => {
    // update firestore
    await firestore.collection("users").doc(`${currentUser.getUID()}`).update({
      post_publicity: preference,
    });

    // update user obj
    const new_user_obj = new User(currentUser.getUID());
    const new_built_user_obj = await new_user_obj.build();
    setCurrentUser(new_built_user_obj);
  };

  return (
    <div className="publicity">
      <Button variant="text" color="primary" onClick={handlePopoverOpen}>
        {publicityDict[postPublicity]}
      </Button>
      <Popover
        open={Boolean(popoverAnchorElement)}
        anchorEl={popoverAnchorElement}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className="popover">
          <h3>Who can see this post?</h3>
          <span style={{ color: "#95a5a6" }}>
            Choose who can see this post.
          </span>
          <br />
          <span style={{ color: "#95a5a6" }}>
            Anyone mentioned can always see.
          </span>
          <List className="publicity_list">
            <ListItem
              key={"public"}
              role={undefined}
              button
              dense
              onClick={async () => {
                setPostPublicity("public");
                handlePopoverClose();

                await updateUserPostPublicity("public");
              }}
            >
              <ListItemAvatar>
                <i class="fas fa-globe-americas"></i>
              </ListItemAvatar>
              <ListItemText primary="Everyone can see this post." />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={postPublicity === "public"}
                  tabIndex={-1}
                  disableRipple
                  onClick={() => setPostPublicity("public")}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem
              key={"friends"}
              button
              dense
              onClick={async () => {
                setPostPublicity("friends");
                handlePopoverClose();

                await updateUserPostPublicity("friends");
              }}
            >
              <ListItemAvatar>
                <i class="fas fa-user-friends"></i>
              </ListItemAvatar>
              <ListItemText primary="Only friends can see this post." />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={postPublicity === "friends"}
                  tabIndex={-1}
                  disableRipple
                  onClick={() => setPostPublicity("friends")}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem
              key={"mentioned"}
              button
              dense
              onClick={async () => {
                setPostPublicity("mentioned");
                handlePopoverClose();

                await updateUserPostPublicity("mentioned");
              }}
            >
              <ListItemAvatar>
                <i class="fas fa-at"></i>
              </ListItemAvatar>
              <ListItemText primary="Only people mentioned can see this" />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={postPublicity === "mentioned"}
                  tabIndex={-1}
                  disableRipple
                  onClick={() => setPostPublicity("mentioned")}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem
              key={"private"}
              button
              dense
              onClick={async () => {
                setPostPublicity("private");
                handlePopoverClose();

                await updateUserPostPublicity("private");
              }}
            >
              <ListItemAvatar>
                <i class="fas fa-lock"></i>
              </ListItemAvatar>
              <ListItemText primary="Only you can see this post." />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={postPublicity === "private"}
                  tabIndex={-1}
                  disableRipple
                  onClick={() => setPostPublicity("private")}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
      </Popover>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PublicityPopover);
