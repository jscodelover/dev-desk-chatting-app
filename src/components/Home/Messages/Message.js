import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

const Message = ({ msg, user, allUsers }) => {
  const isContent = () => {
    return msg.hasOwnProperty("content");
  };
  const msgUser = allUsers.find(u => msg.userID === u.userID);
  return (
    <Comment>
      <Comment.Avatar src={msgUser.picture} />
      <Comment.Content
        className={user.userID === msgUser.userID ? "userMessage" : ""}
      >
        <Comment.Author as="a">{msgUser.username}</Comment.Author>
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
