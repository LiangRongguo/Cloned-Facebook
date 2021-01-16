import React from "react";

import NewsFeedPage from "../news-feed-page/news-feed-page.component";

import "./home-page.styles.scss";

const HomePage = () => (
  <div className="HomePage">
    <div className="main_column">
      <NewsFeedPage />
    </div>
  </div>
);

export default HomePage;
