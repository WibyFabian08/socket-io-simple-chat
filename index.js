const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3001",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (userId !== null) {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });

      users.find((user) => {
        if(user.userId === userId) {
          user.socketId = socketId
          console.log(user)
        }
      })
  }
  
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected with id: ", socket.id);

  // get user id from client
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // get message from client and send to all client
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    console.log(users);
    const user = getUser(receiverId);
    console.log(user);
    io.to(user.socketId).emit("getNewMessage", {
      senderId,
      text,
    });
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  //   // get message from client and broadcast
  //   socket.on("sendText", (text) => {
  //     socket.broadcast.emit('sendToClient', text);
  //   });
});
