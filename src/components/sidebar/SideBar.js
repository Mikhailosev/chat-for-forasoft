import React, { Component } from "react";
import SideBarOption from "./SideBarOption";
import { get, last, differenceBy } from "lodash";
import { createChatNameFromUsers, burger } from "../../Factories";
export default class SideBar extends Component {
  static type = {
    CHATS: "chats",
    USERS: "users"
  };
  constructor(props) {
    super(props);
    this.state = {
      reciever: "",
      activeSideBar: SideBar.type.CHAT
    };
  }
  

  handleSubmit = e => {
    e.preventDefault();
    const { reciever } = this.state;
    const { onSendPrivateMessage } = this.props;
    onSendPrivateMessage(reciever);
    console.log(reciever);
    this.setState({ reciever: "" });
  };
  addChatForUser = username => {
    this.props.onSendPrivateMessage(username);
  };
  setActiveSideBar = newSideBar => {
    this.setState({ activeSideBar: newSideBar });
  };
  render() {
    const {
      chats,
      activeChat,
      user,
      setActiveChat,
      logout,
      users
    } = this.props;
    const { reciever, activeSideBar } = this.state;
    return (
      
      <div>
      <nav className="navbar is-fullwidth" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
    <a className="navbar-item" href="https://bulma.io">
      <img alt="bulma logo"src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/>
    </a>

    <a role="button" id="burger" onClick={burger()}href="# "className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navMenu">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
        </div>



        <div id="navMenu" className="navbar-menu">
          <div className="navbar-start">
          <form onSubmit={this.handleSubmit} className="search">
            <input
              value={reciever}
              onChange={e => {
                this.setState({ reciever: e.target.value });
              }}
              placeholder="Type name of the user to start"
              className="input navbar-item"
              type="text"
            />
            <button className="button navbar-item" type="submit">
              Create a chat
            </button>
          </form>
            <a
              onClick={() => {
                this.setActiveSideBar(SideBar.type.CHATS);
              }}
              href="# "
              className="button navbar-item is-white-ter"
            >
              Chats
            </a>

          <a
            href="# "
            onClick={() => {
              this.setActiveSideBar(SideBar.type.USERS);
            }}
            className="button navbar-item white-ter"
          >
            Users
          </a>
          </div>

        <div className="navbar-end">
          
          
          <div className="">
            <span>{user.name}</span>
            <div
              onClick={() => {
                logout();
              }}
              title="Logout"
              className="logout"
            >
              <button className="button is-primary">Logout</button>
            </div>
          </div>
        </div>

        </div>
      </nav>
      {activeSideBar === SideBar.type.CHATS ? (
            <p className="navbar-item has-text-centered">CHATS</p>
          ) : (
            <p className="navbar-item has-text-centered">USERS</p>
          )}
      <div
            className=""
            ref="users"
            onClick={e => {
              e.target === this.refs.user && setActiveChat(null);
            }}
          >
            {activeSideBar === SideBar.type.CHATS
              ? chats.map(chat => {
                  if (chat.name) {
                    return (
                      <SideBarOption
                        key={chat.id}
                        lastMessage={get(last(chat.messages), "message", "")}
                        name={
                          chat.isCommunity
                            ? chat.name
                            : createChatNameFromUsers(chat.users, user.name)
                        }
                        active={activeChat.id === chat.id}
                        onClick={() => {
                          this.props.setActiveChat(chat);
                        }}
                      />
                    );
                  }
                  return null;
                })
              : differenceBy(users, [user], "name").map(otherUser => {
                  return (
                    <SideBarOption
                      key={otherUser.id}
                      name={otherUser.name}
                      onClick={() => {
                        this.addChatForUser(otherUser.name);
                      }}
                    />
                  );
                })}
          </div>
      </div>
    );

  }
}

