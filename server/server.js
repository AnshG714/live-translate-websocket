import express from "express";
import socketIo from "socket.io";
import http from "http";
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let count = 1;

io.on("connection", (socket) => {
  console.log(`client connect with id ${socket.id}`);

  setInterval(() => {
    socket.emit("transcriptResponse", `Count is ${count}`);
    count++;
  }, 1000);

  socket.on("transcriptReceived", (transcript) => {
    socket.broadcast.emit("transcriptResponse", transcript);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server running on Port ${PORT}`);
});
