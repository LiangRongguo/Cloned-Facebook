import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase.utils";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ContentLoader from "react-content-loader";

import User from "../../classes/User/User";

import "./conversations.styles.scss";

const ConversationLineLoader = (props) => (
  <ContentLoader
    speed={2}
    width={300}
    height={50}
    viewBox="0 0 300 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="19" cy="29" r="17" />
    <rect x="42" y="28" rx="5" ry="5" width="194" height="17" />
    <rect x="42" y="13" rx="0" ry="0" width="119" height="9" />
  </ContentLoader>
);

const ConversationLine = ({ currentUser, target_uid }) => {
  // load most recent message between current user and target user
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.where("uid_from", "in", [
    currentUser.getUID(),
    target_uid,
  ]);
  var [messages] = useCollectionData(query, { idField: "id" });
  if (messages) {
    messages = messages.filter((message) =>
      message.uid_from === currentUser.getUID()
        ? message.uid_to === target_uid
        : message.uid_to === currentUser.getUID()
    );
    messages.sort((a, b) => {
      // sorted by descending order to get latest message
      return b.time - a.time;
    });
  }
  const most_recent_messages = messages && messages[0];

  const [targetUserObj, setTargetUserObj] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // target User Obj
      const target_user_obj = new User(target_uid);
      const built_target_user_obj = await target_user_obj.build();
      setTargetUserObj(built_target_user_obj);
    };

    fetchData();
  }, [target_uid]);

  if (!targetUserObj || !most_recent_messages) {
    // loading page when targetUserObj is not ready
    return <ConversationLineLoader />;
  } else
    return (
      <div className="conversation_line">
        <Link to={`target_uid=${target_uid}`}>
          <img
            src={targetUserObj.getAvatarUrl()}
            alt="conversation_line_avatar"
          />
          <div className="username_and_msg">
            {targetUserObj.getDisplayName()}
            <p className="brief_message">{most_recent_messages.body}</p>
          </div>
        </Link>
      </div>
    );
};

const Conversations = ({ currentUser, conversation_target_uids }) => {
  return (
    <div className="conversations_window">
      <div className="conversations_header">
        <p>Messages</p>
        <div className="new_chat">
          <i class="fab fa-facebook-messenger"></i>&nbsp;New Chat
        </div>
      </div>

      <div className="loaded_conversations">
        {conversation_target_uids.length > 0 ? (
          conversation_target_uids.map((target_uid, index) => (
            <ConversationLine
              key={index}
              currentUser={currentUser}
              target_uid={target_uid}
            />
          ))
        ) : (
          <div>Find someone to start a chat!</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser,
});

export default connect(mapStateToProps)(Conversations);
