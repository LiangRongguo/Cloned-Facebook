import { firestore } from "../../firebase/firebase.utils";
import User from "../User/User";

class Post {
  #pid; // post id
  #author_obj; // user obj for the author
  #body;
  #liked_by;
  #comments;
  #publicity;
  #time;

  constructor(post_id) {
    this.#pid = post_id;
  }

  async build() {
    const postRef = firestore.doc(`posts/${this.#pid}`);
    const postSnapShot = await postRef.get();
    const {
      author_uid,
      body,
      liked_by,
      comments,
      publicity,
      time,
    } = postSnapShot.data();

    // author user obj
    const user_obj = new User(author_uid);
    this.#author_obj = await user_obj.build();

    this.#body = body;
    this.#liked_by = liked_by;
    this.#comments = comments;
    this.#publicity = publicity;
    this.#time = time;

    return this;
  }

  getPostID() {
    return this.#pid;
  }

  getAuthorID() {
    return this.#author_obj.getUID();
  }

  getAuthorAvatarUrl() {
    return this.#author_obj.getAvatarUrl();
  }

  getAuthorName() {
    return this.#author_obj.getDisplayName();
  }

  getPostBody() {
    return this.#body;
  }

  getPostTime() {
    return this.#time;
  }

  getPublicity() {
    return this.#publicity;
  }
}

export default Post;
