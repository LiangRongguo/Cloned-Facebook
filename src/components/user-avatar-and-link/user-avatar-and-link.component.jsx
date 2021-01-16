import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./user-avatar-and-link.styles.scss";

const UserAvatar = ({ id, url }) => {
  return (
    <div className="user_avatar">
      <Link to={`/users/uid=${id}`}>
        <img src={url} alt="post_avatar" />
      </Link>
    </div>
  );
};

UserAvatar.propTypes = {
  id: PropTypes.string,
  url: PropTypes.string,
};

export default UserAvatar;
