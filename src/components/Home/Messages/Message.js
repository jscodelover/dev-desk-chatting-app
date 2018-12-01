import React from "react";
import moment from "moment";
import { Comment } from "semantic-ui-react";

const Message = ({ msg, user }) => {
  console.log(msg, user);
  return (
    <Comment>
      <Comment.Avatar src={msg.user.picture} />
      <Comment.Content
        className={user.userID === msg.user.userID ? "userMessage" : ""}
      >
        <Comment.Author as="a">{msg.user.username}</Comment.Author>
        <Comment.Metadata>
          {moment(msg.timestamp).format(" Do-MM-YY, ddd, h:mm:ss a")}
        </Comment.Metadata>
        <Comment.Text>{msg.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default Message;
