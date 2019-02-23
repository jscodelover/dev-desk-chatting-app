import React from "react";
import { Menu, Label, Icon } from "semantic-ui-react";
import generateId from "../../../util/directmessage";

const DisplayChannel = props => {
  function getCount(id, notification) {
    if (notification.length) {
      let index = notification.findIndex(noti => id === noti.id);
      if (index > -1) {
        return notification[index]["count"];
      }
    }
  }
  const {
    channels,
    activeChannelID,
    notification,
    changeChannel,
    users,
    userID,
    hideStarredID,
    textColor
  } = props;
  return (
    <React.Fragment>
      {channels ? (
        <React.Fragment>
          {channels.length > 0 &&
            channels.map(
              channel =>
                !hideStarredID.includes(channel.id) && (
                  <Menu.Item
                    key={channel.id}
                    name={channel.channelName}
                    onClick={() => {
                      changeChannel(channel);
                    }}
                    active={channel.id === activeChannelID}
                  >
                    <span style={{ color: textColor }}>
                      # {channel.channelName}
                    </span>
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
                !hideStarredID.includes(user.userID) && (
                  <Menu.Item
                    key={user.userID}
                    active={user.userID === activeChannelID}
                    onClick={() => {
                      changeChannel(user);
                    }}
                  >
                    <span style={{ color: textColor }}>
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
