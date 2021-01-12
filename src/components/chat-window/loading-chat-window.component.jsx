import React from "react";
import ContentLoader from "react-content-loader";

import "./chat-window.styles.scss";

const UserAvatarAndNameLoader = () => (
  <ContentLoader
    speed={4}
    width={160}
    height={40}
    viewBox="0 0 200 55"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="25" cy="25" r="23" />
    <rect x="53" y="6" rx="2" ry="2" width="140" height="39" />
  </ContentLoader>
);

const MessageLoader = () => (
  <ContentLoader
    speed={2}
    width={540}
    height={50}
    viewBox="0 0 540 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="25" cy="25" r="23" />
    <rect x="53" y="6" rx="2" ry="2" width="321" height="39" />
  </ContentLoader>
);

const MessageReversedLoader = () => (
  <ContentLoader
    rtl
    speed={1}
    width={540}
    height={50}
    viewBox="0 0 540 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="25" cy="25" r="23" />
    <rect x="53" y="6" rx="2" ry="2" width="321" height="39" />
  </ContentLoader>
);

const LoadingtChatWindow = () => {
  return (
    <div class="chat_window">
      <div className="chat_window_header">
        <div className="chat_window_header_user_detail loader">
          <UserAvatarAndNameLoader />
        </div>
      </div>

      <div className="loaded_messages">
        <div className="message loader">
          <MessageLoader />
        </div>
        <div className="message reversed_loader ">
          <MessageReversedLoader />
        </div>
        <div className="message loader">
          <MessageLoader />
        </div>
        <div className="message reversed_loader ">
          <MessageReversedLoader />
        </div>
        <div className="message loader">
          <MessageLoader />
        </div>
        <div className="message reversed_loader ">
          <MessageReversedLoader />
        </div>
      </div>

      <div className="send_message">
        <form>
          <input placeholder="Message..." />

          <button type="submit" disabled>
            <i class="fas fa-paper-plane fa-lg"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoadingtChatWindow;
