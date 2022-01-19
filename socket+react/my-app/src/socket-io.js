/* let io = require("socket.io-client");
let socket = io.connect("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected");
  socket.on("message", (userData) => {
    console.log(userData);
    socket.emit("message", { userData });
  });
});

*/
/* export const messagingUser = (username, room) => {
  const users = [];
  users.push({ username, room });
  return users;
}; */
