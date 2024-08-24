import {createServer} from 'http'
import { connected } from 'process';
import { Server } from 'socket.io'

const httpServer = createServer();
const socket = new Server(httpServer, {});

socket.on('connection', (socket) => {
    console.log(socket);
})
 
httpServer.listen(6000, () => {
    console.log('Server connected');
})

// check the ss1 for how the connections are established in http connection and it is just cloased after a status is recieved, and it's not always active
// the connection becomes active only between the req sent and res recieved time period

// so for real time data transfer we need to use web sockets, and we will be using socket.io for that.


//////////// Web Sockets //////////////

// the initial connection btw client and server is handshake which happens only once
// if cinnection is success then our data can flow btw server and client
// it is like a phone call first a person has to call someone once the call is connected then the data between the two can flow easily
