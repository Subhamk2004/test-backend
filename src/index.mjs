import express from "express";
import cors from 'cors';
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import recieverRouter from "./routes/reciever.mjs";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/localStrategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { createServer } from "http";
import { Server } from 'socket.io'
// import "./strategies/dicordStrategy.mjs";
// express-validator provides a chainable API for defining validation rules.
// You can use various validation methods like isInt, isEmail, isIn, etc.
// The validationResult middleware collects validation errors.
// It's essential to handle validation errors gracefully to provide informative feedback to the user.

//meanwhile these function don't throw any errors, so we have to handle them ourselves if a query is not passed or is passed incorrectly.

let app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5501', 'http://127.0.0.1:5501', 'https://subhamk2004.github.io/tempclient/']
  }
});
// commited

mongoose
  .connect("mongodb://localhost/expressDatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB", error));

app.use(express.json());
app.use(cookieParser("CookieSecret"));
app.use(
  session({
    secret: "somethingComplicated",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 600000,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  }),
);
// This configuration is using MongoStore to store your session data in MongoDB instead of the default in-memory storage
// With in-memory storage, sessions are lost when the server restarts. Using MongoStore, your sessions will persist even if the server is restarted, as they're stored in the database.
app.use(passport.initialize());
app.use(passport.session());
app.use(usersRouter);
app.use(productsRouter);
app.use(recieverRouter);

// app.use(loggingMiddleware);
// if we don't want to use the middleware globally then we can also pass it specifically to some methods only,
// check the first get method in this file for that
// It also matters where call the middleware to be global, the methods before caaling middleware won't get access to the middleware
// we can call more middlewares in the app.use() also.

// IN express the order matters where you define a function or middleware to call

// This line of code in your Express.js application is essential for parsing incoming JSON data from request bodies.
// In Express.js, route parameters are like placeholders in a URL that capture dynamic values

// Colon (:) Notation: You define a route parameter by including a colon (:) followed by a name within a segment of the URL path. For example:

// app.get('/users/:userId', (req, res) => {
//    ...
// });
// :userId is the route parameter

// Query parameters are essentially additional pieces of information that you can append to a URL. They come after a question mark (?)

// https://example.com/search?query=your+search+term&page=2&sort=newest
// query: is the key, and your+search+term is the value.
// page: is the key, and 2 is the value.
// sort: is the key, and newest is the value.

// A payload is the actual data or content being transmitted in a message.

//  Think of it as the package you're sending, while the address and other details are the envelope.
// Examples of Payloads

//     Email: The body of the email is the payload.
//     HTTP Request: The data sent in the request body.
//     File Transfer: The file itself is the payload.
//     Rocket Launch: The satellite or other object being carried into space.

// PUT and PATCH are HTTP methods used to modify data on a server. The key difference lies in the scope of the modification:
// PUT Request Replaces the entire resource.
// PATCH Request modifies part of the resource.

// Middleware in Express.js is essentially a function that has access to the request (req), response (res) objects,
//  and the (next) middleware function in the application's request-response cycle.
// these are like .then().catch(), despite they are functions also and have logic.

// cookies are nothing but small pieces of data which is used to store sessions etc;
// This data is sent by the web server to the browser
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

  // The code you provided is the part of an Express application that starts the server and logs a message to the console when it's ready to accept requests.

  // The listen() method is used to start the server and make it listen for incoming requests on a specific port.

  // PORT (written in uppercase) is a placeholder for the actual port number where the server will listen

  //  () => { ... }
  // This is a callback function that gets executed when the server successfully starts listening on the specified port.
});
app.get(
  "/",
  loggingMiddleware,
  (request, response, next) => {
    console.log(request.session);
    console.log(request.sessionID);
    request.session.visited = true;
    next();
  },
  (request, response) => {
    response.cookie("CookieName", "cookieValue", {
      maxAge: 60000 * 60,
      signed: true,
    });
    // Cookies can play a major role in authentication, as if a user
    // log in, we will start a cookie session for a time and if user
    // doesn't visit the site for that time we will log out the user
    //
    // If you go directly to other endpoints without first visiting "/":
    // A new session is created for each request because request.session.visited = true is not set.
    // No session-modifying operations are performed, so the session remains uninitialized.

    response.status(201).send({
      msg: "JSON object sent",
    });

    // This code snippet defines a route in an Express application that handles GET requests to the root path (/)

    // app.get is a method provided by Express that is used to define a route handler for GET requests.

    // The first argument (/) specifies the path (URL) for this route. In this case, it's the root path of your application, which is typically accessed by going to http://localhost:<port>

    // The second argument is a callback function that will be executed whenever a GET request is made to the specified path.

    //The callback function receives two arguments:
    //request (req): An object containing information about the incoming request, such as headers, parameters, and body data (though typically empty for GET requests).

    //response (res): An object used to send a response back to the client.

    // 2. response.status(201).send({ ... }):

    //Inside the callback function, the code interacts with the response object to send a response back to the client.
    // .status(201) sets the HTTP status code of the response to 201. This status code indicates that the request has been successful and a new resource has been created (though in this case, we're not actually creating anything new, but it's a common code for successful creation).

    //.send({ ... }) sends the actual content of the response. Here, it's sending a JavaScript Object Notation (JSON) object with a single key-value pair:

    //'msg': "JSON object sent" defines a key named msg with the value "JSON object sent". This creates a simple JSON structure that can be interpreted by the client (like a web browser that understands JSON).
  },
);
app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
  // This route uses Passport's local strategy to authenticate users. The old manual authentication code is commented out.
  let a;
  // below is old auth
  // let {body: {name, password}} = req;
  // let findUser = testUsers.find((user) => user.name === name);
  // if(!findUser) return res.status(404).send({msg:"User not found"});
  // if(findUser.password !== password) return res.status(401).send({msg:"Incorrect credentials"});
  // req.session.user = findUser;
  // console.log(req.session);
  // console.log(req.sessionID);
  // return res.status(200).send(findUser);
});
app.get("/api/auth/status", (req, res) => {
  // You use passport.authenticate() as middleware in your route handler.
  // This middleware handles the authentication process based on the specified strategy (e.g., Local, OAuth, etc.).

  // Successful Authentication:

  // If authentication is successful, Passport attaches the authenticated user object to the req.user property.
  console.log(`Inside the status endpoint`);
  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);
  if (req.user) return res.send(req.user);
  return res.sendStatus(401);
  // Old code is below:
  // req.sessionStore.get(req.sessionID, (err, session) => {
  //     console.log(session);
  // })
  // return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({msg:"Not authorized"});
});
app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.status(200).send("User logged out successfully");
  });
  // After using passport.session(), you can access the logout() function on the req object.
  // This method is used to invalidate the user's session.
});
app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.sendStatus(200);
  },
);
app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  let { body: item } = req;
  // This uses destructuring to extract the request body and rename it to 'item'.

  let { cart } = req.session;
  // This extracts the 'cart' property from the session, if it exists.
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});
app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});


// check the ss1 for how the connections are established in http connection and it is just cloased after a status is recieved, and it's not always active
// the connection becomes active only between the req sent and res recieved time period

// so for real time data transfer we need to use web sockets, and we will be using socket.io for that.


//////////// Web Sockets //////////////

// the initial connection btw client and server is handshake which happens only once
// if cinnection is success then our data can flow btw server and client
// it is like a phone call first a person has to call someone once the call is connected then the data between the two can flow easily
