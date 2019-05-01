const io = require("./index.js").io;
const {
  VERIFY_USER,
  TYPING,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  USER_DISCONNECTED,
  USER_CONNECTED,
  LOGOUT, PRIVATE_MESSAGE
} = require("../Events");
const { createUser, createMessage, createChat } = require("../Factories");
let connectedUsers = {};
let communityChat = createChat({ isCommunity:true});
module.exports = function(socket) {
  console.log("Socket-id" + socket.id);
  let sendMessageToChatFromUser;
  let sendTypingFromUser;
  socket.on(COMMUNITY_CHAT, function(callback) {
    callback(communityChat);
  });
  //Проверить никнейм
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({ isUser: false, user: createUser({ name: nickname, socketId:socket.id }) });
    }
  });
  //Пользователь законектился с никнеймом
  socket.on(USER_CONNECTED, user => {
    user.socketId=socket.id
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    sendTypingFromUser = sendTypingToChat(user.name);
    sendMessageToChatFromUser = sendMessageToChat(user.name);

    console.log(connectedUsers);
    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });
  //Пользователь вышел
  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);

      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log("DISCONNECT", connectedUsers);
    }
  });
  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  });
  //Учитывание того что пользователь пишет
  socket.on(TYPING, ({ chatId, isTyping }) => {
    console.log(chatId, isTyping);
    sendTypingFromUser(chatId, isTyping);
  });
  //Пользователь прервал соединение
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log("DISCONNECT LOG", connectedUsers);
  });
  socket.on(PRIVATE_MESSAGE, ({reciever, sender, activeChat})=>{
    if (reciever in connectedUsers){
      const recieverSocket=connectedUsers[reciever].socketId

if( activeChat===null || activeChat.id===communityChat.id){


      const newChat=createChat({name:`${reciever}&${sender}`, users:[reciever, sender]})
      socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
      socket.emit(PRIVATE_MESSAGE, newChat)
    }else{
      socket.to(recieverSocket).emit(PRIVATE_MESSAGE,activeChat)
    }
    }
  })
};
//Возвращает функцию которая принимает chatid & message
function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}
//Отправляет статус typing или ничего в чат
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}
//Добавление пользователя в список
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}
//Удалить юзера из списка
function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}
//Проверить на то, что пользователь ещё не залогинен
function isUser(userList, username) {
  return username in userList;
}
