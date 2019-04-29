import React, { Component } from "react";
import io from "socket.io-client";
import "bulma/css/bulma.css";
import LoginForm from "./LoginForm";
import ChatContainer from '../components/chats/ChatContainer'
import { USER_CONNECTED, LOGOUT } from "../Events";
const socketUrl = "http://localhost:3231";
export default class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

      function() {
        var burger = document.querySelector(".burger");
        var nav = document.querySelector("#" + burger.dataset.target);

        burger.addEventListener("click", function() {
          burger.classList.toggle("is-active");
          nav.classList.toggle("is-active");
        });
      }
  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);

    socket.on("connect", () => {
      console.log("Connected");
    });

    this.setState({ socket });
  };
  setUser = user => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    this.setState({ user });
  };
  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  };
  render() {
    const { title } = this.props;
    const { socket, user } = this.state;
    return (
      <div className="container">
        {title}
        {
          !user ?
        <LoginForm socket={socket} setUser={this.setUser} />
     :
     <ChatContainer socket={socket} user={user} logout={this.logout}/>
        }
        </div>
    );
  }
}
