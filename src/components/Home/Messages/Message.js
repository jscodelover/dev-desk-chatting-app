import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";
import { addSessionData, getSessionData } from "../../../util/sessionData";

const Message = ({ msg, user, allUsers }) => {
  const isContent = () => {
    return msg.hasOwnProperty("content");
  };
  const msgUser = allUsers.find(u => msg.userID === u.userID);
  const createGroup =
    getSessionData("time") === moment(msg.timestamp).format("Do-MM-YY");
  addSessionData("time", moment(msg.timestamp).format("Do-MM-YY"));
  let todayMsg =
    moment(msg.timestamp).format("Do-MM-YY") ===
    moment(new Date()).format("Do-MM-YY");
  return (
    <React.Fragment>
      {!createGroup ? (
        <div className="dateGroup">
          <hr className="dateLine" />
          <span className="date">
            {todayMsg
              ? `${moment(msg.timestamp).format("MMMM Do YYYY")}, Today`
              : moment(msg.timestamp).format("MMMM Do YYYY")}
          </span>
        </div>
      ) : null}
      <Comment className="message-box">
        <Comment.Avatar src={msgUser.picture} />
        <Comment.Content
          className={user.userID === msgUser.userID ? "userMessage" : ""}
        >
          <Comment.Author as="a">{msgUser.username}</Comment.Author>
          <Comment.Metadata>
            {moment(msg.timestamp).format("h:mm a")}
          </Comment.Metadata>
          {isContent() ? (
            <Comment.Text dangerouslySetInnerHTML={{ __html: msg.content }} />
          ) : (
            <a href={msg.image} target="_blank" downloadable={true}>
              <Image src={msg.image} size="medium" rounded />
            </a>
          )}
        </Comment.Content>
      </Comment>
    </React.Fragment>
  );
};

export default Message;
