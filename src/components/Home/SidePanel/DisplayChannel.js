import React from "react";
import { Menu, Label } from "semantic-ui-react";

const DisplayChannel = props => {
  function getCount(id, notification) {
    console.log(notification);
    if (notification.length) {
      let index = notification.findIndex(noti => id === noti.id);
      console.log(index);
      if (index > -1) return notification[index]["count"];
    }
  }
  console.log("display channel");
  const { channels, activeChannelID, notification, changeChannel } = props;
  return (
    <React.Fragment>
      {channels.length > 0 &&
        channels.map(channel => (
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
              <Label color="red">{getCount(channel.id, notification)}</Label>
            ) : (
              ""
            )}
          </Menu.Item>
        ))}
    </React.Fragment>
  );
};

export default DisplayChannel;
