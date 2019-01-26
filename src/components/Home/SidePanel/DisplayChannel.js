import React from "react";
import { Menu, Label, Icon } from "semantic-ui-react";

const DisplayChannel = props => {
  function getCount(id, notification) {
    if (notification.length) {
      let index = notification.findIndex(noti => id === noti.id);
      if (index > -1) {
        return notification[index]["count"];
      }
    }
  }
  function generateId(user, userID) {
    return user.userID > userID
      ? `${user.userID}${userID}`
      : `${userID}${user.userID}`;
  }
  const {
    channels,
    activeChannelID,
    notification,
    changeChannel,
    users,
    userID,
    starredID
  } = props;
  return (
    <React.Fragment>
      {channels ? (
        <React.Fragment>
          {channels.length > 0 &&
            channels.map(
              channel =>
                !starredID.includes(channel.id) && (
                  <Menu.Item
                    key={channel.id}
                    name={channel.channelName}
                    onClick={() => {
                      changeChannel(channel);
                    }}
                    active={channel.id === activeChannelID}
                  >
                    <span># {channel.channelName}</span>
                    {getCount(channel.id, notification) ? (
                      <Label color="red">
                        {getCount(channel.id, notification)}
                      </Label>
                    ) : (
                      ""
                    )}
                  </Menu.Item>
                )
            )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {users.length &&
            users.map(
              user =>
                !starredID.includes(user.userID) && (
                  <Menu.Item
                    key={user.userID}
                    active={user.userID === activeChannelID}
                    onClick={() => {
                      changeChannel(user);
                    }}
                  >
                    <span>
                      <Icon
                        name="circle"
                        color={user.status === "online" ? "green" : "red"}
                      />
                      {user.username}
                    </span>
                    {getCount(generateId(user, userID), notification) ? (
                      <Label color="red">
                        {getCount(generateId(user, userID), notification)}
                      </Label>
                    ) : (
                      ""
                    )}
                  </Menu.Item>
                )
            )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DisplayChannel;
