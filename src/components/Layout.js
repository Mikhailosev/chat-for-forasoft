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
    const { socket, user } = this.state;
    return (
      <div className="container">
       
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
document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});