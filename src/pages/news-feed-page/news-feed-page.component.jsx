import React from "react";

import SendPost from "../../components/send_post/send-post.component";
import LoadedPosts from "../../components/loaded-posts/loaded-posts.component";

import "./news-feed-page.styles.scss";

const NewsFeedPage = (props) => {
  return (
    <div>
      <SendPost />
      <LoadedPosts />
    </div>
  );
};

export default NewsFeedPage;
