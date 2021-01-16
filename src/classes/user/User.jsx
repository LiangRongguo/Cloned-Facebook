import { firestore, storageRef } from "../../firebase/firebase.utils";

class User {
  // private member
  #uid;
  #avatarUrl;
  #displayName;
  #friend_array;
  #post_publicity;
  #profileBackgroundImgUrl;

  constructor(
    uid,
    async_displayName,
    async_friend_array,
    async_avatar_url,
    async_post_publicity,
    async_profileBackgroundImgUrl
  ) {
    this.#uid = uid;
    this.#displayName = async_displayName;
    this.#friend_array = async_friend_array;
    this.#avatarUrl = async_avatar_url;
    this.#post_publicity = async_post_publicity;
    this.#profileBackgroundImgUrl = async_profileBackgroundImgUrl;
  }

  /**
   * Constructor function to do async functions to fetch data like avatar url from firebase
   * Example:
   *  const user_obj = new User(...)
   *  const built_user_obj = user_obj.build
   */
  async build() {
    // avatar url
    var avatarUrl = await this.fetchAvatarURL();

    // Profile Background Img Url
    var profileBackgroundImgUrl = await this.fetchProfileBackgroundImgUrl();

    const userRef = firestore.doc(`users/${this.#uid}`);
    const userSnapShot = await userRef.get();
    // display name, friend array
    const { displayName, friend_array, post_publicity } = userSnapShot.data();

    return new User(
      this.#uid,
      displayName,
      friend_array,
      avatarUrl,
      post_publicity,
      profileBackgroundImgUrl
    );
  }

  getUID() {
    return this.#uid;
  }

  getPostPublicity() {
    return this.#post_publicity;
  }

  setAvatarUrl(url) {
    this.#avatarUrl = url;
  }

  getAvatarUrl() {
    return this.#avatarUrl;
  }

  setProfileBackgroundImgUrl(url) {
    this.#profileBackgroundImgUrl = url;
  }

  getProfileBackgroundImgUrl() {
    return this.#profileBackgroundImgUrl;
  }

  getDisplayName() {
    return this.#displayName;
  }

  getFriendArray() {
    return this.#friend_array;
  }

  async fetchAvatarURL() {
    var defaultAvatarRef = storageRef.child("avatars/default_avatar.png");
    var defaultAvatarUrl = await defaultAvatarRef.getDownloadURL();

    var avatarRef = storageRef.child("avatars/" + this.#uid + "_avatar.png");
    var avatarUrl = await avatarRef
      .getDownloadURL()
      .then((url) => {
        return url;
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            return defaultAvatarUrl;

          default:
            return defaultAvatarUrl;
        }
      });

    return avatarUrl;
  }

  async fetchProfileBackgroundImgUrl() {
    var defaultImgRef = storageRef.child("profile_background/default.png");
    var defaultImgUrl = await defaultImgRef.getDownloadURL();

    var imgRef = storageRef.child("profile_background/" + this.#uid + ".png");
    var imgUrl = await imgRef
      .getDownloadURL()
      .then((url) => {
        return url;
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            return defaultImgUrl;

          default:
            return defaultImgUrl;
        }
      });

    return imgUrl;
  }
}

export default User;
