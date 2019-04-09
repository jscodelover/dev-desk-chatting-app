import React from "react";
import { Picker } from "emoji-mart";
import { Icon } from "semantic-ui-react";
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
      <div
        onClick={this.openEmojiPicker}
        style={{
          padding: "0px 3px 0px 5px",
          border: "1px solid #e2b605",
          display: "flex",
          marginRight: "1px",
          alignItems: "center",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        <Icon
          name="smile outline"
          style={{ fontSize: "20px", color: "#e2b605" }}
        />
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
