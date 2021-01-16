import React, { useState } from "react";
import { Link } from "react-router-dom";
import LikePanel from "../like-panel/like-panel.component";
import Tooltip from "@material-ui/core/Tooltip";

import Message from "../../classes/Message/Message";

import "./message-line.styles.scss";

import { convertUnixTime } from "../../utils/utils";

const MessageLine = ({ msg, currentUser, targetUserObj }) => {
  const [displayMessageMenu, setDisplayMessageMenu] = useState(false);

  const messageClass =
    msg.uid_from === currentUser.getUID() ? "sent" : "received";

  const _toggleMessageMenu = (event) => {
    event.preventDefault();
    setDisplayMessageMenu(!displayMessageMenu);
  };

  const _handleLikeMessage = async (currentUserID, messageID, liked_by) => {
    const message_obj = new Message(messageID);

    if (!liked_by.includes(currentUserID)) {
      // current user hasn't liked it
      await message_obj.likedBy(currentUserID, liked_by);
    }
    // current user has already liked it
    else {
      await message_obj.unLikedBy(currentUserID, liked_by);
    }
  };

  return (
    <div
      className={`message ${messageClass}`}
      onMouseEnter={_toggleMessageMenu}
      onMouseLeave={_toggleMessageMenu}
    >
      {/* User Avatar */}
      <Link to={`/users/uid=${msg.uid_from}`}>
        <img
          src={
            msg.uid_from === currentUser.getUID()
              ? currentUser.getAvatarUrl()
              : targetUserObj.getAvatarUrl()
          }
          alt="message_user_avatar"
        />
      </Link>

      {/* Message Body */}
      <Tooltip title={convertUnixTime(msg.time)}>
        <p
          onDoubleClick={(event) => {
            event.preventDefault();
            _handleLikeMessage(currentUser.getUID(), msg.id, msg.liked_by);
          }}
        >
          {msg.body}
        </p>
      </Tooltip>

      {/* Message Menu */}
      <div
        className={`message_menu ${messageClass} ${
          displayMessageMenu ? "display" : "hidden"
        }`}
      >
        <Tooltip title="Like">
          <div
            className="option"
            onClick={(event) => {
              event.preventDefault();
              _handleLikeMessage(currentUser.getUID(), msg.id, msg.liked_by);
            }}
          >
            <i class="far fa-heart"></i>
          </div>
        </Tooltip>

        <Tooltip title="More">
          <div className="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </Tooltip>
      </div>

      {/* Like */}
      <LikePanel currentUserUID={currentUser.getUID()} msg={msg} />
    </div>
  );
};

export default MessageLine;
