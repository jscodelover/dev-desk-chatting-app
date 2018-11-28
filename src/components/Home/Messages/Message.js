import React from "react";
import moment from "moment";
import { Comment } from "semantic-ui-react";

const Message = ({ msg, user }) => {
  console.log(moment(msg.timestamp)._d);
  return (
    <Comment>
      <Comment.Avatar src={msg.user.picture} />
      <Comment.Content
        className={user.userID === msg.user.userID ? "userMessage" : ""}
      >
        <Comment.Author as="a">{msg.user.username}</Comment.Author>
        <Comment.Metadata>
          {moment(msg.timestamp).toISOString(true)}
        </Comment.Metadata>
        <Comment.Text>{msg.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default Message;
