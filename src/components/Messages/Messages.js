import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import Firebase from "../../Firebase/firebase.js";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./Messages.css"

class ConnectedMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      content: "",
      user: null,
      readError: null,
      writeError: null,
      loadingChats: false,
      sellerName: "",
      orderId: this.props.orderId,
      sender: this.props.fromCustomer ? "customer" : "lola",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;

    //load chats on app iniitalization, and when a new chat is sent
    try {
      firebase
      .database()
      .ref(
        `chats/${this.state.orderId}`
      )
      .on("value", (snapshot) => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });

        chats.sort(function(a, b) {
          return a.timestamp - b.timestamp;
        });
        this.setState({ chats });

        if (chatArea != null) {
          chatArea.scrollBy(0, chatArea.scrollHeight);
        }

        this.setState({ loadingChats: false });
      });
    } catch (error) {
      console.log("error", error);
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  handleChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleDealChange = (event) => {
    this.setState({
      dealValue: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;

    if (this.state.content.length > 0) {
      Firebase.postChats(
        this.state.sender,
        this.state.orderId,
        this.state.content,
      )
      .then((val) => {
        this.setState({ content: "" });
        chatArea.scrollBy(0, chatArea.scrollHeight);
      })
      .catch((error) => {
        this.setState({ writeError: error.message });
      });
    }
  };

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${d.getMonth() +
      1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <div className="Messages-area-container">
        <div
          className="Messages-area-header"
          style={{
            marginBottom: 20,
            fontSize: 22,
          }}
        >
          <div className="Orders-infoCard-title">Message Lola</div>
          {this.state.sender == "lola" && (
            <div className="Messages-close" onClick={this.props.closeMessageClient}>
              X
            </div>
          )}
        </div>

        <div className="Messages-area" ref={this.myRef}>
          {this.state.loadingChats ? (
            <div className="spinner-border text-success" role="status">
              <CircularProgress className="circular" />;
            </div>
          ) : (
            ""
          )}
          {this.state.chats.map((chat) => {
            return chat.sender == this.state.sender ? (
              <div
                key={chat.timestamp}
                className= "Messages-bubble Messages-bubble-sender float-right"
              >
                {chat.content}
                <span className="Messages-time float-right">
                  {this.formatTime(chat.timestamp)}
                </span>
              </div>
            ) : (
              <div

                key={chat.timestamp}
                className= "Messages-bubble float-left"
              >
                {chat.content}
                <span className="Messages-time float-right">
                  {this.formatTime(chat.timestamp)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="Messages-area-sendmsg">
          <form onSubmit={this.handleSubmit} className="mx-3">
            <textarea
              className="form-control"
              name="content"
              onChange={this.handleChange}
              value={this.state.content}
            ></textarea>
            {this.state.error ? (
              <p className="text-danger">{this.state.error}</p>
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              className="btn"
            >
              =||=
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

let Messages = withRouter(connect(mapStateToProps)(ConnectedMessages));
export default withRouter(Messages);
