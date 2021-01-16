import React from "react";
import ContentLoader from "react-content-loader";

const PostLoader = (props) => (
  <ContentLoader
    speed={2}
    width={700}
    height={100}
    viewBox="0 0 700 100"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="48" y="8" rx="3" ry="3" width="88" height="8" />
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <rect x="0" y="53" rx="3" ry="3" width="650" height="10" />
    <rect x="0" y="73" rx="3" ry="3" width="650" height="10" />
    <rect x="0" y="93" rx="3" ry="3" width="250" height="10" />
    <circle cx="20" cy="20" r="20" />
  </ContentLoader>
);

export const PostLoaders = (props) => (
  <div className="loaded_posts_wrapper">
    <div className="post-line">
      <PostLoader props={props} />
    </div>
    <div className="post-line">
      <PostLoader props={props} />
    </div>
    <div className="post-line">
      <PostLoader props={props} />
    </div>
  </div>
);

export default PostLoader;
