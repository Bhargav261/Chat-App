const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

const io = socketIo(server);

const messages = [];
const userList = {};
const readMessage = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send initial messages to the connected user
  socket.emit('initialMessages', messages);

  socket.on('sendMessage', (message) => {
    message.id = messages?.length + 1;
    message.timestamp = new Date(message.timestamp)

    messages.push(message);
    // socket.emit('newMessage', {message, authUserID: message?.sendrId});
    if (readMessage[message?.receiverId]) {
      readMessage[message?.receiverId][message?.sendrId] = true;
    } else {
      readMessage[message?.receiverId] = { [message?.sendrId]: true }
    }

    socket.broadcast.emit('newMessage', { message, authUserID: message?.receiverId, readMessage });
  });

  socket.on('loginRequest', (userName) => {
    const userListLength = Object.values(userList)?.length;
    let newUser = { id: userListLength + 1, name: userName };

    if (userList[userName]) {
      userList[userName].status = true;
      newUser = userList[userName]
    } else {
      newUser = { id: userListLength + 1, name: userName, status: true };
      userList[userName] = newUser;
    }

    socket.emit('loginSuccessRequest', newUser);
    socket.broadcast.emit('newUserDetail', newUser);
  });

  socket.on('getMessage', (messageData) => {

    const { reseverId, senderID, filterMessageBy } = messageData;

    if (readMessage?.[senderID] && readMessage?.[senderID]?.[reseverId]) {
      readMessage[senderID][reseverId] = false;
    }

    const filterMessage = messages.filter(item => {
      const messageDate = new Date(item.timestamp);
      const currentDate = new Date();


      if (filterMessageBy === 'today') {
        return (
          (item.sendrId === senderID && item.receiverId === reseverId) ||
          (item.sendrId === reseverId && item.receiverId === senderID)
        ) && messageDate.toDateString() === currentDate.toDateString();
      } else if (filterMessageBy === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);

        return (
          (item.sendrId === senderID && item.receiverId === reseverId) ||
          (item.sendrId === reseverId && item.receiverId === senderID)
        ) && messageDate >= sevenDaysAgo;
      } else {
        return (
          (item.sendrId === senderID && item.receiverId === reseverId) ||
          (item.sendrId === reseverId && item.receiverId === senderID)
        );
      }
    });

    filterMessage.sort((a, b) => a.timestemp - b.timestemp);

    socket.emit('getMessages', filterMessage);
    // socket.broadcast.emit('getMessages', filterMessage);
  });


  socket.on('fetchUserList', () => {
    socket.emit('getUserList', { userList: Object.values(userList), readMessage });
  });

  socket.on('updateReadMessageList', (messageData) => {
    const { receiverId, sendrId } = messageData;

    if (readMessage?.[receiverId] && readMessage?.[receiverId]?.[sendrId]) {
      readMessage[receiverId][sendrId] = false;
    }
  });


  socket.on('logout', (userId) => {

    if (userList[userId]) {
      userList[userId].status = false;
    }

    socket.broadcast.emit('updateUserStatus', userId);
  });



  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is listening on port 3000');
});
