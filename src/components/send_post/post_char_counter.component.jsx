import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const PostCharCounter = ({ POST_CHAR_LIMIT, postBody }) => {
  return (
    <div
      className={`counter-option ${
        POST_CHAR_LIMIT - postBody.length > 9 ? "double" : "single"
      } ${
        POST_CHAR_LIMIT - postBody.length > 30
          ? POST_CHAR_LIMIT - postBody.length > 70
            ? ""
            : "orange"
          : "red"
      }`}
    >
      <div className="bottom_circle">
        <CircularProgress size={25} variant="determinate" value={100} />
      </div>
      <CircularProgress
        size={25}
        variant="determinate"
        value={(postBody.length * 100) / POST_CHAR_LIMIT}
      />

      {POST_CHAR_LIMIT - postBody.length < 71 && (
        <div
          className={`counter ${
            POST_CHAR_LIMIT - postBody.length > 9 ? "double" : "single"
          } ${POST_CHAR_LIMIT - postBody.length > 30 ? "orange" : "red"}`}
        >
          {POST_CHAR_LIMIT - postBody.length}
        </div>
      )}
    </div>
  );
};

export default PostCharCounter;
