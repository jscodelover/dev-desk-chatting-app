import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import DisplayChannel from "./DisplayChannel";
import {
  setChannel,
  setPrivateChannel,
  setActiveChannelID
} from "../../../store/action";

class Starred extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideStarredID_ForChannel: [],
      hideStarredID_ForUser: []
    };
  }
  componentDidMount() {
    this.findHiddenStarredID();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.starred !== this.props.starred) this.findHiddenStarredID();
  }

  findHiddenStarredID = () => {
    const { otherUsers, channelIDs, starred } = this.props;
    let hideForChannel = channelIDs.reduce((acc, channel_id) => {
      let result = starred.includes(channel_id);
      if (!result && (acc.length === 0 || !acc.includes(result))) {
        return acc.concat(channel_id);
      }
      return acc;
    }, []);
    this.setState({ hideStarredID_ForChannel: hideForChannel });

    let hideForUser = otherUsers.reduce((acc, user) => {
      let result = starred.includes(user.userID);
      if (!result && (acc.length === 0 || !acc.includes(result))) {
        return acc.concat(user.userID);
      }
      return acc;
    }, []);
    this.setState({ hideStarredID_ForUser: hideForUser });
  };

  changeChannel = channel => {
    this.props.setActiveChannelID(channel.id);
    this.props.setChannel({ ...channel });
    this.props.setPrivateChannel(false);
  };

  generateId = user => {
    return user.userID > this.props.user.userID
      ? `${user.userID}${this.props.user.userID}`
      : `${this.props.user.userID}${user.userID}`;
  };

  changeUser = user => {
    this.props.setActiveChannelID(user.userID);
    this.props.setChannel({
      channelName: user.username,
      id: this.generateId(user)
    });
    this.props.setPrivateChannel(true);
  };

  render() {
    const { hideStarredID_ForChannel, hideStarredID_ForUser } = this.state;
    const { otherChannels, otherUsers, activeChannelID, user } = this.props;
    return (
      <Menu.Menu style={{ marginBottom: "2rem" }}>
        <Menu.Item>
          <span>
            <Icon name="star" /> Starred
          </span>
        </Menu.Item>
        <DisplayChannel
          hideStarredID={hideStarredID_ForChannel}
          channels={otherChannels}
          activeChannelID={activeChannelID}
          notification=""
          changeChannel={channel => {
            this.changeChannel(channel);
          }}
        />
        <DisplayChannel
          hideStarredID={hideStarredID_ForUser}
          users={otherUsers}
          activeChannelID={activeChannelID}
          notification=""
          userID={user.userID}
          changeChannel={user => {
            this.changeUser(user);
          }}
        />
      </Menu.Menu>
    );
  }
}

const mapStateToProps = ({ user, channel }) => {
  return {
    otherUsers: user.otherUsers,
    otherChannels: channel.otherChannels,
    channelIDs: channel.channelIDs,
    activeChannelID: channel.activeChannelID,
    starred: user.currentUser.starred.split(","),
    user: user.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelID: id => dispatch(setActiveChannelID(id)),
    setPrivateChannel: isPrivate => dispatch(setPrivateChannel(isPrivate)),
    setChannel: channelInfo => dispatch(setChannel(channelInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Starred);
