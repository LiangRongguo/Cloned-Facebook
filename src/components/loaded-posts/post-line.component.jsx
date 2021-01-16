import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UserAvatar from "../user-avatar-and-link/user-avatar-and-link.component";
import PostLoader from "./post-loader.component";
import Tooltip from "@material-ui/core/Tooltip";

import {
  convertUnixTime,
  convertUnixTimeToFullDate,
  convertPublicityToIconAndTooltip,
} from "../../utils/utils";
import Post from "../../classes/Post/Post";

const PostLine = ({ post_id }) => {
  const [postObj, setPostObj] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setPostObj(null);

      // target User Obj
      const target_post_obj = new Post(post_id);
      const built_target_post_obj = await target_post_obj.build();
      setPostObj(built_target_post_obj);
    };

    fetchData();
  }, [post_id]);

  if (postObj) {
    console.log(postObj);
    return (
      <div className="post-line">
        <div className="header">
          <UserAvatar
            id={postObj.getAuthorID()}
            url={postObj.getAuthorAvatarUrl()}
          />
          <div className="user_info">
            <Link to={`/users/uid=${postObj.getAuthorID()}`}>
              <span className="username">{postObj.getAuthorName()}</span>
            </Link>
            <br />
            <div className="second_row">
              <Tooltip
                title={convertUnixTimeToFullDate(postObj.getPostTime())}
                arrow
              >
                <Link to={`/posts/pid=${postObj.getPostID()}`}>
                  <span className="timestamp">
                    {convertUnixTime(postObj.getPostTime())}
                  </span>
                </Link>
              </Tooltip>
              &nbsp;·&nbsp;
              <Tooltip
                title={
                  convertPublicityToIconAndTooltip(postObj.getPublicity())[
                    "tooltip"
                  ]
                }
                arrow
              >
                <Link to="#">
                  <span className="publicity">
                    {
                      convertPublicityToIconAndTooltip(postObj.getPublicity())[
                        "icon"
                      ]
                    }
                  </span>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="post_body">{postObj.getPostBody()}</div>
      </div>
    );
  } else {
    return (
      <div className="post-line">
        <PostLoader />
      </div>
    );
  }
};

export default PostLine;
