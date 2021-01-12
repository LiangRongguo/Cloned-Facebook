import React, { useEffect } from "react";
import { firestore } from "../../firebase/firebase.utils";
import { useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { connect } from "react-redux";

import Conversations from "../../components/conversations/conversations.component";
import ChatWindow from "../../components/chat-window/chat-window.component";
import UserDetails from "../../components/user-detail/user-detail.component";

import "./messages-page.styles.scss";

const MessagesPage = ({ currentUser }) => {
  let { target_uid } = useParams();

  const messagesRef = firestore.collection("messages");

  // query for messages sent by current User
  const query_msg_sent_by_current_user = messagesRef.where(
    "uid_from",
    "==",
    currentUser.getUID()
  );
  var [
    messages_sent_by_current_user,
  ] = useCollectionData(query_msg_sent_by_current_user, { idField: "id" });

  // query for messages received by current User
  const query_msg_received_by_current_user = messagesRef.where(
    "uid_to",
    "==",
    currentUser.getUID()
  );
  var [
    messages_received_by_current_user,
  ] = useCollectionData(query_msg_received_by_current_user, { idField: "id" });

  // dictionary to track the time stamp for each latest message
  var dict_id_to_msg_time = {};

  // init the array to save recent chat targets
  var conversation_target_uids = [];
  // save uids of chat targets
  messages_sent_by_current_user &&
    messages_sent_by_current_user.forEach((msg) => {
      if (!conversation_target_uids.includes(msg.uid_to)) {
        conversation_target_uids.push(msg.uid_to);
      }
      // update dict
      if (
        !(msg.uid_to in dict_id_to_msg_time) ||
        dict_id_to_msg_time[msg.uid_to] < msg.time
      ) {
        dict_id_to_msg_time[msg.uid_to] = msg.time;
      }
    });
  messages_received_by_current_user &&
    messages_received_by_current_user.forEach((msg) => {
      if (!conversation_target_uids.includes(msg.uid_from)) {
        conversation_target_uids.push(msg.uid_from);
      }
      // update dict
      if (
        !(msg.uid_from in dict_id_to_msg_time) ||
        dict_id_to_msg_time[msg.uid_from] < msg.time
      ) {
        dict_id_to_msg_time[msg.uid_from] = msg.time;
      }
    });

  // sort uids by latest message time
  conversation_target_uids.sort(
    (a, b) => dict_id_to_msg_time[b] - dict_id_to_msg_time[a]
  );

  if (conversation_target_uids.length > 0)
    target_uid = target_uid == null ? conversation_target_uids[0] : target_uid;

  useEffect(() => {
    const func = async () => {};

    func();
  }, [target_uid]);

  return (
    <div className="MessagesPage">
      <div className="left_column">
        <div className="user_details">
          <UserDetails />
        </div>

        <div className="conversations">
          {conversation_target_uids && (
            <Conversations
              conversation_target_uids={conversation_target_uids}
            />
          )}
        </div>
      </div>

      {conversation_target_uids.length > 0 ? (
        <div className="ChatWindow">
          {target_uid && <ChatWindow target_uid={target_uid} />}
        </div>
      ) : (
        <div className="ChatWindow">No user to chat</div>
      )}
    </div>
  );
};

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser,
});

export default connect(mapStateToProps)(MessagesPage);
