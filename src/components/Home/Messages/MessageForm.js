/* eslint-disable no-useless-escape */
import * as React from "react";
import uuidv4 from "uuid/v4";
import TextareaAutosize from "react-textarea-autosize";
import { Segment, Button, Progress, Form } from "semantic-ui-react";
import firebase from "../../../util/firebaseConfig";
import FileModal from "./FileModal";
import Typing from "./Typing";
import * as typeFn from "../../../util/typingfn";
import * as session from "../../../util/sessionData";
import Emoji from "./Emoji";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageRef: firebase.storage().ref(),
      message: "",
      file: "",
      loading: false,
      error: [],
      modal: false,
      uploadTask: null,
      uploadStatus: "",
      uploadPercentage: 0,
      cursorPos: 0,
      selectedText: "",
      selectedPosition: {
        start: null,
        end: null
      }
    };
  }

  componentDidMount() {
    this.getStoragedData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channel.channelName !== this.props.channel.channelName)
      this.getStoragedData();
  }

  getStoragedData() {
    if (session.getSessionData(this.props.channel.id))
      this.setState({ message: session.getSessionData(this.props.channel.id) });
    else this.setState({ message: "" });
  }

  getMessage = event => {
    this.setState({ [event.target.name]: event.target.value });
    typeFn.typingAdd(event.target.value, this.props.channel, this.props.user);
    if (event.target.value)
      session.addSessionData(this.props.channel.id, event.target.value);
    else session.removeSessionData(this.props.channel.id);
    this.setState({
      cursorPos: event.target.selectionStart
    });
  };

  formatting = (message, text, replaceText, trim) => {
    if (replaceText) {
      for (let t of replaceText) {
        let htmlData =
          text === "blockquote"
            ? t.slice(trim, t.length)
            : t.slice(trim, t.length - trim);
        message = message.replace(t, `<${text}>${htmlData} </${text}>`);
      }
    }
    return message;
  };

  formattedMessage = message => {
    message = message.replace(/\r?\n/g, "<br>");

    const blockQuote = message.match(/(<br>+>>>|^>>>).+\w\S/g);
    message = this.formatting(message, "blockquote", blockQuote, 3);

    message = message.replace(/<br>/g, "%");

    let oneLineQuote = message.match(/(%>+|^>+)[^%]+(?!=%)/g);
    if (oneLineQuote) {
      for (let quote of oneLineQuote) {
        quote = quote.replace(/^(?:%)+/g, "");
        message = message.replace(
          quote,
          `<blockquote>${quote.slice(1, quote.length)} </blockquote>`
        );
      }
    }

    const boldDetector = message.match(
      /(?<=\s|^|%|_|~|`|>)(\*[^%\*.]+\*)(?=\s|%|_|~|`|<|$)/g
    );

    message = this.formatting(message, "b", boldDetector, 1);
    const italicDetector = message.match(
      /(?<=\s|^|%|\*|~|`|>)(_[^%_.]+_)(?=\s|%|\*|~|`|<|$)/g
    );
    message = this.formatting(message, "i", italicDetector, 1);

    const strikeThrough = message.match(
      /(?<=\s|^|%|_|\*|`|>)(~[^%~.]+~)(?=\s|%|\*|_|`|<|$)/g
    );
    message = this.formatting(message, "strike", strikeThrough, 1);

    const blockCode = message.match(/```.+?```/g);
    if (blockCode) {
      let messageForInlineCode;
      for (let m of blockCode) {
        messageForInlineCode = message.replace(m, "");
      }
      message = this.formatting(message, "pre", blockCode, 3);
      const inlineCode = messageForInlineCode.match(/(?<=\s|^|%)(`[^%`.]+`)/g);
      message = this.formatting(message, "code", inlineCode, 1);
    } else {
      const inlineCode = message.match(/(?<=\s|^|%)(`[^%`.]+`)/g);
      message = this.formatting(message, "code", inlineCode, 1);
    }
    // return message.replace(/\s/g, "&nbsp;");
    message = message.replace(/%/g, "<br>");
    this.setState({ message });
    return message;
  };

  createMessage = (user, message) => {
    const { file } = this.state;
    const messageObj = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userID: user.userID
    };
    if (file !== "") {
      messageObj["image"] = file;
    } else {
      messageObj["content"] = message;
    }
    return messageObj;
  };

  sendMessage = () => {
    const { messageRef, channel, user } = this.props;
    const { message, error } = this.state;

    if (message.trim()) {
      this.setState({ loading: true });
      messageRef
        .child(channel.id)
        .push()
        .set(this.createMessage(user, this.formattedMessage(message)))
        .then(() => {
          this.setState({ loading: false, message: "", error: [] });
          typeFn.typingRemove(channel, user);
          session.removeSessionData(channel.id);
        })
        .catch(() => {
          this.setState({
            loading: false,
            error: error.concat("message can't be send. Try Again !!")
          });
        });
    } else {
      this.setState({
        loading: false,
        error: error.concat("write the message")
      });
    }
  };

  sendFileMessage = pathToUpload => {
    const { messageRef, user } = this.props;
    const { error } = this.state;

    messageRef
      .child(pathToUpload.id)
      .push()
      .set(this.createMessage(user))
      .then(() => {
        this.setState({
          file: "",
          uploadStatus: "done",
          error: []
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          uploadStatus: "fail",
          error: error.concat(
            " Error in Uploading file in Database. Try Again!! "
          )
        });
      });
  };

  getSelectionPosition = event => {
    this.setState({
      selectedText: window.getSelection().toString(),
      selectedPosition: {
        start: event.target.selectionStart,
        end: event.target.selectionEnd
      }
    });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  uploadFile = file => {
    const pathToUpload = this.props.channel;
    const metaData = { contentType: file.type };
    const { storageRef } = this.state;

    this.setState(
      {
        uploadTask: storageRef
          .child(`${pathToUpload.channelName}/images/${uuidv4()}.jpg`)
          .put(file, metaData),
        uploadStatus: "uploading"
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snapshot => {
            let uploadPercentage = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ uploadPercentage });
          },
          error => {
            this.setState({
              error: this.state.error.concat(error.message),
              uploadTask: "",
              uploadStatus: "fail"
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                this.setState({ file: downloadURL, uploadTask: "" });
                this.sendFileMessage(pathToUpload);
              })
              .catch(err => {
                this.setState({
                  error: this.state.error.push(err),
                  uploadTask: "",
                  uploadStatus: "fail"
                });
              });
          }
        );
      }
    );
  };

  addEmoji = emoji => {
    const { message, cursorPos } = this.state;
    const part1 = message.slice(0, cursorPos);
    const part2 = message.slice(cursorPos);
    this.setState({ message: `${part1}${emoji}${part2}` });
  };

  handleCommand = event => {
    if (event.key.toLowerCase() === "j") event.preventDefault();
    if (event.ctrlKey && event.key === "Enter") this.sendMessage();
    else if (event.ctrlKey && event.key.toLowerCase() === "b")
      this.formatTextAreaMessage("*");
    else if (event.ctrlKey && event.key.toLowerCase() === "i")
      this.formatTextAreaMessage("_");
    else if (event.ctrlKey && event.key.toLowerCase() === "j")
      this.formatTextAreaMessage("```");
  };

  formatTextAreaMessage = tag => {
    const { message, selectedPosition, selectedText } = this.state;

    let textBeforeSelection = message.substring(0, selectedPosition.start);
    let textAfterSelection = message.substring(
      selectedPosition.end,
      message.length
    );

    this.setState({
      message: `${textBeforeSelection} ${tag}${selectedText}${tag} ${textAfterSelection}`
    });
  };

  render() {
    const {
      message,
      loading,
      modal,
      uploadStatus,
      uploadPercentage
    } = this.state;
    const { user, typingUsers, sideBarVisible } = this.props;
    const btn1 = user.color.theme[1];
    const btn2 = user.color.theme[2];
    return (
      <Segment
        className={
          typingUsers.length ? "messageForm typingSpace" : "messageForm"
        }
        fluid={true.toString()}
      >
        {typingUsers.length ? <Typing typingUsers={typingUsers} /> : null}
        {uploadStatus === "uploading" ? (
          <Progress
            style={{
              position: "fixed",
              top: "12%",
              left: "66px",
              right: sideBarVisible ? "260px" : "14px"
            }}
            percent={uploadPercentage}
            inverted
            progress
            color="green"
          />
        ) : (
          ""
        )}
        <Form>
          <div className="editor">
            <TextareaAutosize
              ref={ref => (this.input = ref)}
              placeholder="Write your message..."
              onClick={this.getMessage}
              onKeyDown={this.handleCommand}
              name="message"
              value={message}
              onChange={this.getMessage}
              onSelect={this.getSelectionPosition}
              style={{
                maxHeight: "175px",
                minHeight: "41px"
              }}
            />
          </div>
        </Form>

        {/* <Input
            fluid
            style={{ marginBottom: "0.7rem" }}
            label={
              <Emoji
                onSelect={emoji => {
                  this.addEmoji(emoji);
                }}
              />
            }
            value={message}
            onChange={this.getMessage}
            loading={loading}
            labelPosition="left"
            placeholder="Write your message..."
            className={error.some(err => err.includes("message")) ? "error" : ""}
          /> */}
        <Button.Group icon width="3" fluid className="ctlBtn">
          <Emoji
            onSelect={emoji => {
              this.addEmoji(emoji);
            }}
          />
          <Button
            style={{ backgroundColor: btn1, color: user.color.text }}
            color="orange"
            content="Add Reply"
            disabled={loading}
            icon="edit"
            labelPosition="left"
            onClick={this.sendMessage}
          />
          <Button
            style={{ backgroundColor: btn2, color: user.color.text }}
            color="teal"
            content="Add File"
            disabled={uploadStatus === "uploading"}
            icon="upload"
            labelPosition="left"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
      </Segment>
    );
  }
}

export default MessageForm;
