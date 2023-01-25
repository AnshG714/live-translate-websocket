import express from "express";
import http from "http";
import websocket from "websocket";
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const SocketServer = websocket.server;

const wsServer = new SocketServer({ httpServer: server });

const connections = [];

wsServer.on("request", (req) => {
  console.log("Connection opened");
  const connection = req.accept();
  connections.push(connection);

  connection.on("message", (mes) => {
    connections.forEach((element) => {
      if (element != connection) {
        connection.sendUTF(mes.utf8Data);
      }
    });

    console.log(mes);
  });

  connection.on("close", (resCode, des) => {
    console.log("connection closed");
    connections.splice(connections.indexOf(connection), 1);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server running on Port ${PORT}`);
});
