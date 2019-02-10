import React from "react";

const Typing = ({ typingUsers }) => {
  return (
    <div className="typing">
      {typingUsers.map((u, index) => {
        if (index !== typingUsers.length - 1) return <span key={index}>{u}, </span>;
        return <span key={index}>{u} </span>;
      })}
      <span>is typing...</span>
    </div>
  );
};

export default Typing;
