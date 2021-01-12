import { firestore } from "../../firebase/firebase.utils";

class Message {
  #mid = null; // message id

  constructor(mid) {
    this.#mid = mid;
  }

  async likedBy(uid, liked_by_array) {
    // check for safety
    if (liked_by_array.includes(uid)) return;

    // add data
    liked_by_array.push(uid);

    await firestore.collection("messages").doc(`${this.#mid}`).update({
      liked_by: liked_by_array,
    });
  }

  async unLikedBy(uid, liked_by_array) {
    // check for safety
    if (!liked_by_array.includes(uid)) return;

    // delete data
    liked_by_array.splice(liked_by_array.indexOf(uid), 1);

    await firestore.collection("messages").doc(`${this.#mid}`).update({
      liked_by: liked_by_array,
    });
  }
}

export default Message;
