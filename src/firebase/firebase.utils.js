import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyCCwEvtqvgqOpk2DZcuYrgIFOs_0YypNC0",
  authDomain: "facebook-995aa.firebaseapp.com",
  databaseURL: "https://facebook-995aa-default-rtdb.firebaseio.com",
  projectId: "facebook-995aa",
  storageBucket: "facebook-995aa.appspot.com",
  messagingSenderId: "159889411982",
  appId: "1:159889411982:web:01cbd8b3f029e22a28dedf"
};

/**
 * function to create a user profile in the firestore if not existed
 * @param userAuth
 * @param additionalData
 */
export const createUserProfileDocument = async (userAuth, additionalData) => {
  // if no user auth, simply return
  if (!userAuth) return;

  // query inside the firestore
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const userSnapShot = await userRef.get();

  if (!userSnapShot.exists) {
    // if user not yet exist, create one prrofile for him/her!

    const { displayName, email } = userAuth; // user name
    const create_time = new Date(); // creation date time
    const friend_array = [];

    try {
      await userRef.set({
        displayName,
        email,
        create_time,
        friend_array,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user profile", error.message);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const storageRef = firebase.storage().ref();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
