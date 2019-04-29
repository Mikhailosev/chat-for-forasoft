import React, { Component } from "react";
import { SideBarOption } from './SideBarOption'
import { get, last} from 'lodash'
export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reciever: ""
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { reciever } = this.state;
    const { onSendPrivateMessage } = this.props;
    onSendPrivateMessage(reciever);
		console.log(reciever);
		this.setState({reciever:""})
  };
  render() {
    const { chats, activeChat, user, setActiveChat, logout } = this.props;
    const { reciever } = this.state;
    return (
      <div className="column is-full">
        <div className="menu">
          <div className="title">Cool Chat </div>
          <form onSubmit={this.handleSubmit} className="search">
            <i className="search-icon" />
            <input
              value={reciever}
              onChange={e => {
                this.setState({ reciever: e.target.value });
              }}
              placeholder="Search"
              type="text"
            />
            <div className="plus" />
          </form>
          <p className="menu-label">CHATS</p>
          <div
            className="menu-list users is-active"
            
            ref="users"
            onClick={e => {
              e.target === this.refs.user && setActiveChat(null);
            }}
          >
            {chats.map(chat => {
              if (chat.name) {


                return (
                 <SideBarOption
                 key={chat.id}
                 name={chat.name}
                 lastMessage={get(last(chat.messages),'message', '')}
                  active={activeChat.id===chat.id}
                  onClick={ ()=>{this.props.setActiveChat(chat)}}
                  />
                );
              }

              return null;
            })}
          </div>

          <div className="column is-full current-user">
            <span>{user.name}</span>
            <div
              onClick={() => {
                logout();
              }}
              title="Logout"
              className="logout"
            >
              <button className="button is-large is-primary">Logout</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

