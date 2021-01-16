import React, { useState, useEffect } from "react";
import User from "../../classes/User/User";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";

import "./like-panel.styles.scss";

const LikePanel = ({ currentUserUID, msg }) => {
  const [userAvatarsDisplay, setUserAvatarsDisplay] = useState(false);
  const [userIdAndAvatarUrls, setUserIdAndAvatarUrls] = useState([]);

  const _showUserAvatars = (event) => {
    event.preventDefault();
    setUserAvatarsDisplay(true);
  };

  const _hideUserAvatars = (event) => {
    event.preventDefault();
    setUserAvatarsDisplay(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const liked_by_array = msg.liked_by;
      var user_id_and_avatar_urls = [];
      liked_by_array.forEach(async (liked_by_uid) => {
        const user_obj = new User(liked_by_uid);
        const built_user_obj = await user_obj.build();
        user_id_and_avatar_urls.push({
          uid: liked_by_uid,
          displayName: built_user_obj.getDisplayName(),
          avatar_url: built_user_obj.getAvatarUrl(),
        });
      });
      setUserIdAndAvatarUrls(user_id_and_avatar_urls);
    };

    fetchData();
  }, [msg]);

  return msg.liked_by.length === 0 ? (
    <div></div>
  ) : (
    <div
      className="like_panel"
      id={currentUserUID === msg.uid_from ? "sent" : "received"}
      onMouseEnter={_showUserAvatars}
      onMouseLeave={_hideUserAvatars}
    >
      <i class="fas fa-heart"></i>
      {msg.liked_by.length > 1 && (
        <div className="like_counter">&nbsp;{msg.liked_by.length}</div>
      )}
      <Divider
        id={userAvatarsDisplay ? "display" : "hidden"}
        orientation="vertical"
        flexItem
      />
      <div
        className="like_user_avatars"
        id={userAvatarsDisplay ? "display" : "hidden"}
      >
        {userIdAndAvatarUrls.map((id_and_url, index) => {
          return (
            <Tooltip title={id_and_url.displayName} key={index}>
              <img src={id_and_url.avatar_url} alt={index} />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default LikePanel;
