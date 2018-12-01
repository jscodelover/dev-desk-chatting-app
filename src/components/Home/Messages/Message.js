import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const Message = ({ msg, user }) => {
  const isContent = () => {
    return msg.hasOwnProperty("content");
  };
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
        {isContent() ? (
          <Comment.Text>{msg.content}</Comment.Text>
        ) : (
          <Image src={msg.image} size="medium" rounded />
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
