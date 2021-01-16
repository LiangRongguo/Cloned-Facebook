import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import LoadingtChatWindow from "./loading-chat-window.component";
import MessageLine from "../message-line/message-line.component";

import User from "../../classes/User/User";

import "./chat-window.styles.scss";

const ChatWindow = ({ currentUser, target_uid }) => {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  // firestore only supports a few number of queries
  // so we first only query on uid_from field
  const query = messagesRef.where("uid_from", "in", [
    currentUser.getUID(),
    target_uid,
  ]);

  var [messages] = useCollectionData(query, { idField: "id" });

  if (messages) {
    // then we filter by uid_to field
    messages = messages.filter((message) =>
      message.uid_from === currentUser.getUID()
        ? message.uid_to === target_uid
        : message.uid_to === currentUser.getUID()
    );
    // sorted by time in ascending order
    messages.sort((a, b) => {
      return a.time - b.time;
    });
  }

  const [targetUserObj, setTargetUserObj] = useState(null);
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();

    await messagesRef.add({
      body: formValue,
      time: Date.now(),
      uid_from: currentUser.getUID(),
      uid_to: targetUserObj.getUID(),
      liked_by: [],
    });

    setFormValue("");
    dummy != null &&
      dummy.current != null &&
      dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      setTargetUserObj(null);

      // target User Obj
      const target_user_obj = new User(target_uid);
      const built_target_user_obj = await target_user_obj.build();
      setTargetUserObj(built_target_user_obj);

      // scroll to bottom
      dummy != null && dummy.current != null && dummy.current.scrollIntoView();
    };

    fetchData();
  }, [target_uid]);

  if (!targetUserObj) {
    // loading page when targetUserObj is not ready
    return <LoadingtChatWindow />;
  } else
    return (
      <div class="chat_window">
        <div className="chat_window_header">
          {targetUserObj && (
            <div className="chat_window_header_user_detail">
              <Link to={`/users/uid=${targetUserObj.getUID()}`}>
                <img
                  src={targetUserObj.getAvatarUrl()}
                  alt="message_target_user_avatar"
                />
                <span>{targetUserObj.getDisplayName()}</span>
              </Link>
            </div>
          )}
        </div>

        <div className="loaded_messages">
          {targetUserObj &&
            messages &&
            messages.map((msg, index) => {
              return (
                <MessageLine
                  key={index}
                  msg={msg}
                  currentUser={currentUser}
                  targetUserObj={targetUserObj}
                />
              );
            })}

          {/* dummy div for scrolling */}
          <span ref={dummy}></span>
        </div>

        <div className="send_message">
          <form onSubmit={sendMessage}>
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Message..."
            />

            <button type="submit" disabled={!formValue}>
              <i class="fas fa-paper-plane fa-lg"></i>
            </button>
          </form>
        </div>
      </div>
    );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps)(ChatWindow);
