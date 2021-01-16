import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ContentLoader from "react-content-loader";

import User from "../../classes/User/User";

import "./user-detail.styles.scss";

const UserDetailsLoader = (props) => (
  <ContentLoader
    speed={2}
    width={300}
    height={200}
    viewBox="0 0 300 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="7" y="8" rx="2" ry="2" width="270" height="180" />
  </ContentLoader>
);

function UserDetails({ target_uid, currentUser }) {
  const [targetUserObj, setTargetUserObj] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setTargetUserObj(null);

      // target User Obj
      if (!target_uid) {
        setTargetUserObj(currentUser);
        return;
      }
      const target_user_obj = new User(target_uid);
      const built_target_user_obj = await target_user_obj.build();
      setTargetUserObj(built_target_user_obj);
    };

    fetchData();
  }, [target_uid, currentUser]);

  if (targetUserObj)
    return (
      <div className="user_details">
        <Link to={`/users/uid=${targetUserObj.getUID()}`}>
          <img src={targetUserObj.getAvatarUrl()} alt="avatar" />
        </Link>
        <div className="user_details_text">
          <Link to={`/users/uid=${targetUserObj.getUID()}`}>
            <h4>{targetUserObj.getDisplayName()}</h4>
          </Link>
          <span>UID: {targetUserObj.getUID()}</span>
        </div>
      </div>
    );
  else return <UserDetailsLoader className="user_details" />;
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser,
});

export default connect(mapStateToProps)(UserDetails);
