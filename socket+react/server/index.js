const app = require("express")();
const http = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(http, {
  path: "/my-app",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors);

io.use((socket, next) => {
  const log = socket.handshake.auth.log;
  const username = socket.handshake.auth.username;
  socket.username = username;
  console.log("username", username);
  const room = socket.handshake.auth.room;
  socket.room = room;
  socket.log = {
    username: socket.username,
    room: socket.room,
    typing: false,
  };
  next();
});

io.on("connection", (socket) => {
  console.log("is connected: ", socket.username);
  console.log("at room: ", socket.room);
  socket.join(socket.room);
  socket.join(socket.username);
  const users = getUsers();
  io.to(socket.room).emit("show_users", users);

  socket.on("joinRoom", (room) => {
    io.in(socket.room).emit(
      "login_message",
      `${socket.username} just joined room: ${room}`
    );
  });

  socket.on("send_message", (data) => {
    socket.broadcast.to(data.room).emit("receive_message", data);
  });

  socket.on("send_private_message", (data) => {
    console.log(data);
    socket.broadcast.to(data.to).emit("show_users_inChat", users);
    socket.broadcast.to(data.from).to(data.to).emit("receive_privMsg", data);
  });

  socket.on("select_user", (data) => {
    io.in(socket.room).emit("user_private", data);
  });

  socket.on("typing", (isTyping) => {
    console.log(" typing: ", isTyping);
    socket.log.typing = isTyping;
    io.to(socket.room).emit("show_users", users);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} has disconnected ${socket.room}`);
    const users = getUsers();
    io.to(socket.room).emit("show_users", users);
    io.in(socket.room).emit(
      "logout_message",
      `${socket.username} has disconnected`
    );
  });
});

function getUsers() {
  let users = [];
  const sockets = io.sockets.sockets;
  for (const socket of sockets) {
    users.push(socket[1].log);
  }
  return users;
}

http.listen(3000, function () {
  console.log("listening on port 3000");
});
