import React, { createRef, useState } from "react";
// import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CheckIcon from "@material-ui/icons/Check";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import { storage } from "../../firebase/firebase.utils";
import { setCurrentUser } from "../../redux/user/user.actions";

import "./user-profile-page.styles.scss";
import User from "../../classes/user/User";

const UserProfilePage = ({ currentUser, setCurrentUser }) => {
  // states for upload profile photo
  const [profilePhoto, setprofilePhoto] = useState(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [
    uploadProfilePhotoModalOpen,
    setUploadProfilePhotoModalOpen,
  ] = useState(false);
  const fileInput = createRef();

  const [profileMenuTabsIndex, setProfileMenuTabsIndex] = useState(0);

  const handleUploadProfilePhotoModalOpen = () => {
    setprofilePhoto(null);
    setUploadProgress(-1);
    setUploadProfilePhotoModalOpen(true);
  };

  const handleUploadProfilePhotoModalOpenClose = () => {
    setprofilePhoto(null);
    setUploadProgress(-1);
    setUploadProfilePhotoModalOpen(false);
  };

  const handleProfileMenuTabsIndexChange = (event, newTabIndex) => {
    event.preventDefault();
    setProfileMenuTabsIndex(newTabIndex);
  };

  const handleProfilePhotoChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      setPreviewPhotoUrl(URL.createObjectURL(event.target.files[0]));
      setUploadProgress(-1);
      setprofilePhoto(event.target.files[0]);
    }
  };

  const handleUploadProfilePhotoUpload = (event) => {
    event.preventDefault();

    if (!profilePhoto) return;

    const uploadTask = storage
      .ref(`avatars/${currentUser.getUID()}_avatar.png`)
      .put(profilePhoto);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress(() => {
          const value = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          return value === 100 ? 99 : value;
        });
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref(`avatars/${currentUser.getUID()}_avatar.png`)
          .getDownloadURL()
          .then(async (url) => {
            // update current User obj
            const new_user_obj = new User(currentUser.getUID());
            const new_built_user_obj = await new_user_obj.build();
            setCurrentUser(new_built_user_obj);
            setUploadProgress(100);
          });
      }
    );
  };

  const modalUploadProfileImage = (
    <div className="modal_uoload">
      <div className="modal_header">
        <span>Upload a profile picture!</span>
        <div className="close_icon">
          <i
            class="fas fa-times fa-lg"
            onClick={handleUploadProfilePhotoModalOpenClose}
          ></i>
        </div>
      </div>

      <div className="divider">
        <Divider />
        <Divider />
      </div>

      <div className="display_image">
        <img
          src={
            previewPhotoUrl ||
            "https://cdn0.iconfinder.com/data/icons/simpline-mix/64/simpline_27-256.png"
          }
          alt="display"
        />
      </div>

      <div className="divider">
        {uploadProgress === -1 ? (
          <div className="simple_divider">
            <Divider />
            <Divider />
          </div>
        ) : (
          <LinearProgress
            className={`progress_bar ${uploadProgress === 100 && "done"}`}
            variant="determinate"
            value={uploadProgress}
          />
        )}
      </div>

      <div className="footer">
        <div className="select_button button">
          <input
            id="select_file_button"
            ref={fileInput}
            type="file"
            accept="image/png"
            onChange={handleProfilePhotoChange}
            hidden
          />
          <label htmlFor="select_file_button">
            <Button className="select" variant="contained" component="span">
              {profilePhoto ? "Selected" : "Select"}
            </Button>
          </label>
          {profilePhoto && (
            <div className="selected_img">
              <span>&nbsp;&nbsp;{profilePhoto.name}&nbsp;&nbsp;</span>
              <i
                class="fas fa-times"
                onClick={() => {
                  if (uploadProgress > -1 && uploadProgress < 100) return;
                  if (fileInput && fileInput.current)
                    fileInput.current.value = "";
                  setPreviewPhotoUrl(null);
                  setUploadProgress(-1);
                  setprofilePhoto(null);
                }}
              ></i>
            </div>
          )}
        </div>

        <div className="upload_button button">
          <Button
            className="cancel"
            onClick={handleUploadProfilePhotoModalOpenClose}
            variant="contained"
          >
            CLOSE
          </Button>

          <Button
            className={`upload ${uploadProgress === 100 && "done"}`}
            variant="contained"
            color="primary"
            onClick={
              uploadProgress === 100
                ? handleUploadProfilePhotoModalOpenClose
                : handleUploadProfilePhotoUpload
            }
            disabled={!profilePhoto}
          >
            {uploadProgress === -1 ? (
              "Upload"
            ) : uploadProgress === 100 ? (
              <Tooltip title="Close">
                <CheckIcon />
              </Tooltip>
            ) : (
              `${uploadProgress}%`
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="UserProfilePage">
      <div className="ProfileHeader">
        <div className="BackgroundImage">
          <div className="image_wrapper">
            <img
              src={currentUser.getProfileBackgroundImgUrl()}
              alt="background_image"
            />
            <div className="change_cover_photo">
              <i class="fas fa-camera"></i> &nbsp; <span>Edit Cover Photo</span>
            </div>
          </div>
        </div>

        <div className="UserAvatar">
          <img src={currentUser.getAvatarUrl()} alt="avatar_image" />
          <Tooltip title="Edit Profile Photo" placement="right-end">
            <div
              className="change_user_avatar"
              onClick={handleUploadProfilePhotoModalOpen}
            >
              <i class="fas fa-camera"></i>
            </div>
          </Tooltip>
        </div>

        <div className="UserName">
          <h1>{currentUser.getDisplayName()}</h1>
        </div>

        <div className="profile_menu_tabs">
          <Divider className="divider" variant="middle" />
          <br></br>
          <Tabs
            className="tabs"
            value={profileMenuTabsIndex}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            onChange={handleProfileMenuTabsIndexChange}
            aria-label="profile menu tabs"
          >
            <Tab className="tab" label="Posts" />
            <Tab className="tab" label="About" />
            <Tab
              className="tab"
              label={`Friends ${currentUser.getFriendArray().length}`}
            />
            <Tab className="tab" label="Photos" />
            <Tab className="tab" label="More" />
          </Tabs>
        </div>
      </div>

      <Modal
        open={uploadProfilePhotoModalOpen}
        onClose={handleUploadProfilePhotoModalOpenClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalUploadProfileImage}
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);
