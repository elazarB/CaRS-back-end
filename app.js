const express = require("express");
const path = require("path");
const http = require("http");
// A module that knows how to solve the security problem of the course
// that by default it is not possible to send a request from domain A to domain B
const cors = require("cors");
// Sets the server time as Israel time
process.env.TZ = 'Israel';

const {routesInit} = require("./routes/configRoutes");
require("./db/mongoConnect");

const app = express();

// Allows each domain to make requests to the server
app.use(cors());

// Defines to the server that it can receive information of type Jason in Buddy in requests that are not GET
app.use(express.json());

// Makes sure that the public folder and all the files in it are exposed on the client side
app.use(express.static(path.join(__dirname,"public")));

// A function that defines all the timed routes in a server-side application
routesInit(app);

// Setting up a server with app capabilities that represents the express
const server = http.createServer(app);
// A variable that will define which port we will work on
let port = process.env.PORT || 3002;
// Starting the server and listening to the requested port
server.listen(port);
