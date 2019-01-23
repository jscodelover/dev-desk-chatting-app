import React from "react";
import { Menu, Icon } from "semantic-ui-react";

class Starred extends React.Component {
  render() {
    return (
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name="star" /> Starred
          </span>{" "}
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default Starred;
