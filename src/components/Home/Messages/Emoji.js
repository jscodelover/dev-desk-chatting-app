import React from "react";
import { Picker } from "emoji-mart";
import { Button, Icon } from "semantic-ui-react";
import "emoji-mart/css/emoji-mart.css";

class Emoji extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPicker: false
    };
  }

  addEmoji = e => {
    let emojiPic = "";
    if (e.unified.length <= 5) {
      emojiPic = String.fromCodePoint(`0x${e.unified}`);
    } else {
      let sym = e.unified.split("-");
      let codesArray = [];
      sym.forEach(el => codesArray.push("0x" + el));
      emojiPic = String.fromCodePoint(...codesArray);
    }
    if (this.props.onSelect) this.props.onSelect(emojiPic);
  };

  openEmojiPicker = () => {
    this.setState(prevState => {
      return { openPicker: !prevState.openPicker };
    });
  };

  render() {
    const { openPicker } = this.state;
    return (
      <div>
        <Button icon onClick={this.openEmojiPicker}>
          <Icon name="smile outline" />
        </Button>
        {openPicker && (
          <Picker
            set="google"
            onSelect={this.addEmoji}
            title="Pick your emoji..."
            style={{
              width: "293px",
              position: "absolute",
              left: "0px",
              bottom: "38px"
            }}
            showPreview={false}
          />
        )}
      </div>
    );
  }
}

export default Emoji;
