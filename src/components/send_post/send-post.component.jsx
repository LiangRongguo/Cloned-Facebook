import React, { useState } from "react";
import { connect } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";

import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import CustomSnackbar from "../snackbar/snackbar.component";
import UserAvatar from "../user-avatar-and-link/user-avatar-and-link.component";
import PublicityPopover from "./publicity-popover.component";
import PostCharCounter from "./post_char_counter.component";

import "./send-post.styles.scss";

const SendPost = ({ currentUser }) => {
  const postsRef = firestore.collection("posts");

  const POST_CHAR_LIMIT = 280;

  const [postBody, setPostBody] = useState("");
  const [postPublicity, setPostPublicity] = useState("public");
  const [popoverAnchorElement, setPopoverAnchorElement] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setPopoverAnchorElement(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorElement(null);
  };

  const handleTextareaChange = (event) => {
    event.preventDefault();
    if (event.target.value.length > POST_CHAR_LIMIT)
      setPostBody(event.target.value.slice(0, POST_CHAR_LIMIT));
    else {
      setPostBody(event.target.value);
    }
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();

    try {
      await postsRef
        .add({
          body: postBody,
          time: Date.now(),
          author_uid: currentUser.getUID(),
          publicity: postPublicity,
          liked_by: [],
        })
        .then(() => {
          setPostBody("");

          // set snackbar
          setSnackbarOpen(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Your post was sent.");
        });
    } catch (error) {
      setPostBody("");

      // set snackbar
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(
        "Error occured when sending your post: " + error.message
      );
    }
  };

  return (
    <div className="post">
      <div className="post_first_row">
        <UserAvatar
          id={currentUser.getUID()}
          url={currentUser.getAvatarUrl()}
        />

        <form className="form" onSubmit={handleSubmitPost}>
          <div className="group">
            <TextareaAutosize
              className="form-input"
              value={postBody}
              onChange={handleTextareaChange}
              rowsMax={5}
            />
            <label
              className={`${postBody.length ? "shrink" : ""} form-input-label`}
            >
              What's on your mind, {currentUser.getDisplayName()}?
            </label>
          </div>

          {postBody.length > 0 && (
            <PublicityPopover
              postPublicity={postPublicity}
              setPostPublicity={setPostPublicity}
              handlePopoverOpen={handlePopoverOpen}
              handlePopoverClose={handlePopoverClose}
              popoverAnchorElement={popoverAnchorElement}
            />
          )}

          <div className="post_second_row">
            <div className="post_left_options">
              <Button className="post_image post_option" variant="text">
                <i class="far fa-image fa-lg"></i>
              </Button>
              <Button className="post_emoji post_option" variant="text">
                <i class="far fa-laugh fa-lg"></i>
              </Button>
            </div>

            <div className="post_right_options">
              {postBody.length > 0 && (
                <PostCharCounter
                  POST_CHAR_LIMIT={POST_CHAR_LIMIT}
                  postBody={postBody}
                />
              )}
              <div className="post_button">
                <Button type="submit" variant="contained">
                  Post
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <CustomSnackbar
        open={snackbarOpen}
        handleClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(SendPost);
