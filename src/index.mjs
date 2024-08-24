import express from "express";
import cors from 'cors';
import { createServer } from "http";
import { Server } from 'socket.io'

let app = express();
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5501', 'http://127.0.0.1:5501', 'https://subhamk2004.github.io'],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5501', 'http://127.0.0.1:5501', 'https://subhamk2004.github.io'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});
// commited
app.use(express.json());

let users = {};
io.on("connection", (socket) => {
  socket.on('register', (data) => {
    console.log(data);
    users[data.from] = socket.id;
    // users[data.from] = socket.id;
    console.log(users);
  })
  socket.on('message', (data) => {
    if (data.to && data.text) {
      const targetedSocketId = users[data.to];
      console.log('Targeted Socket Id: ', targetedSocketId);

      if (targetedSocketId) {
        console.log(targetedSocketId);
        socket.to(targetedSocketId).emit('recieve', {
          text: data.text
        });
      }
    }
  })

});
//
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// check the ss1 for how the connections are established in http connection and it is just cloased after a status is recieved, and it's not always active
// the connection becomes active only between the req sent and res recieved time period

// so for real time data transfer we need to use web sockets, and we will be using socket.io for that.


//////////// Web Sockets //////////////

// the initial connection btw client and server is handshake which happens only once
// if cinnection is success then our data can flow btw server and client
// it is like a phone call first a person has to call someone once the call is connected then the data between the two can flow easily
