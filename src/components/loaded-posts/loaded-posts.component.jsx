import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { PostLoaders } from "./post-loader.component";
import PostLine from "./post-line.component";

import "./loaded-posts.styles.scss";

const LoadedPosts = ({ currentUser }) => {
  const [loadedPosts, setLoadedPosts] = useState(undefined);

  /**
   * Due to the limitation of firestore query,
   * we need to combine several queries
   * to fetch all posts for current user
   *
   * - posts by current user
   * - posts by friends's "public", "friends"
   * - posts that mention current user
   */
  const postsRef = firestore.collection("posts");

  // posts by current user
  const query = postsRef.where("author_uid", "==", currentUser.getUID());
  var [posts] = useCollectionData(query, { idField: "id" });

  useEffect(() => {
    const fetchData = async () => {
      posts &&
        posts.sort((a, b) => {
          return b.time - a.time;
        });
      setLoadedPosts(posts);
    };
    fetchData();
  }, [posts]);

  if (loadedPosts === undefined) {
    return <PostLoaders />;
  } else {
    return (
      <div className="loaded_posts_wrapper">
        {loadedPosts.map((post, index) => {
          console.log(post.id);
          return <PostLine post_id={post.id} />;
        })}
      </div>
    );
  }
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(LoadedPosts);
