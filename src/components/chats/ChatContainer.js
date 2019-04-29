import React, { Component } from "react";
import SideBar from "../sidebar/SideBar";
import ChatHeading from "../chats/ChatHeading";
import Messages from "../messages/Messages";
import MessageInput from "../messages/MessageInput";

import {
  COMMUNITY_CHAT,
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  TYPING,
  PRIVATE_MESSAGE
} from "../../Events";
class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      activeChat: null
    };
  }
  componentDidMount() {
    const { socket } = this.props;
    this.initSocket(socket)
  }
  initSocket(socket){
    const {user}=this.props
    socket.emit(COMMUNITY_CHAT, this.resetChat)
    socket.on(PRIVATE_MESSAGE, this.addChat)
    socket.on('connect', ()=>{
      socket.emit(COMMUNITY_CHAT, this.resetChat)
    })
  }

  sendOpenPrivateMessage=(reciever)=>{
    const { socket, user }=this.props
    const {activeChat}=this.state
    socket.emit(PRIVATE_MESSAGE, {reciever, sender:user.name, activeChat})
  }
  //Восстановление чата к тому который был передан
  resetChat = chat => {
    return this.addChat(chat, true);
  };
  //Добавление чата в контейнер, если RESET = TRUE, удаляет все чаты
  addChat = (chat, reset=false) => {
    console.log(chat);
    const { socket } = this.props;
    const { chats } = this.state;

    const newChats = reset ? [chat] : [...chats, chat];
    this.setState({ chats: newChats, activeChat:reset?chat:this.state.activeChat });

    const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;

    socket.on(typingEvent, this.updateTypingInChat(chat.id));
    socket.on(messageEvent, this.addMessageToChat(chat.id));
  };
  //Возвращает функцию которая будет добавлять сообщение в чат с переданным chatId
  addMessageToChat = chatId => {
    return message => {
      const { chats } = this.state;
      let newChats = chats.map(chat => {
        if (chat.id === chatId) chat.messages.push(message);
        return chat;
      });
      this.setState({ chats: newChats });
    };
  };
  //Добавляет сообщение в выбранный чат
  updateTypingInChat = chatId => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user.name) {

        const { chats } = this.state;

        let newChats = chats.map((chat) => {
          if (chat.id === chatId) {
            if (isTyping && !chat.typingUsers.includes(user)){
              chat.typingUsers.push(user);
            } else if (!isTyping && chat.typingUsers.includes(user)){
              chat.typingUsers = chat.typingUsers.filter(u => u !== user);
            }
          }
          return chat;
        })
        this.setState({ chats: newChats })
      }
    };
  };
  // Добавляет сообщение с выбранным чатом

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, { chatId, message });
  };
  //Отправляет сообщение со статусом на сервер
  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };
  setActiveChat = activeChat => {
    this.setState({ activeChat });
  };
  render() {
    const { user, logout } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className="columns is-multiline">
        <SideBar
        onSendPrivateMessage={this.sendOpenPrivateMessage}
          logout={logout}
          chats={chats}
          user={user}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />
        <div className="column is-full has-text-centered">
          {activeChat !== null ? (
            <div className="column">
              <ChatHeading name={activeChat.name} />
              <Messages
                messages={activeChat.messages}
                user={user}
                typingUsers={activeChat.typingUsers}
              />
              <MessageInput
                sendMessage={message => {
                  this.sendMessage(activeChat.id, message);
                }}
                sendTyping={isTyping => {
                  this.sendTyping(activeChat.id, isTyping);
                }}
              />
            </div>
          ) : (
            <div className="chat-room choose">
              <h1>CHOOSE A CHAT</h1>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ChatContainer;
