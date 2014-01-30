/** // SETTING UP BACKEND // **/

// var express = require("express"); // imports express
  // , server = http.createServer(app)


// var app = express();        // create a new instance of express

// // imports the fs module (reading and writing to a text file)
// var http = require('http');
// var fs = require("fs");
// var path = require("path");
// var io = require('socket.io').listen(app);


var express = require("express");
var http = require('http');
var app = express();
var fs = require("fs");
var path = require("path");






// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'static')));
  // ^ this line makes it so that instead of doing localhost:5000/static/index.html
  //   i can just type localhost:5000

// The global datastore for this example
var listings;

// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

// get all items
app.get("/listings", function(request, response){
  response.send({
    listings: listings,
    success: true
  });
});

// get one item
app.get("/listings/:id", function(request, response){
  var id = request.params.id;
  var item = listings[id];
  response.send({
    listings: item,
    success: (item !== undefined)
  });
});

// create new item
app.post("/listings", function(request, response) {
  console.log(request.body);
  var item = {"desc": request.body.desc,
              "author": request.body.author,
              "date": new Date(),
              "price": Number(request.body.price),
              "sold": false };

  var successful = 
      (item.desc !== undefined) &&
      (item.author !== undefined) &&
      (item.price !== undefined);

  if (successful) {
    listings.push(item);
    writeFile("data.txt", JSON.stringify(listings));
  } else {
    item = undefined;
  }

  response.send({ 
    item: item,
    success: successful
  });
});

// update one item
app.put("/listings/:id", function(request, response){
  // change listing at index, to the new listing
  var id = request.params.id;
  var oldItem = listings[id];
  var item = { "desc": request.body.desc,
               "author": request.body.author,
               "date": new Date(),
               "price": request.body.price,
               "sold": request.body.sold };
  item.desc = (item.desc !== undefined) ? item.desc : oldItem.desc;
  item.author = (item.author !== undefined) ? item.author : oldItem.author;
  item.price = (item.price !== undefined) ? item.price : oldItem.price;
  item.sold = (item.sold !== undefined) ? JSON.parse(item.sold) : oldItem.sold;

  // commit the update
  listings[id] = item;
  writeFile("data.txt", JSON.stringify(listings));

  response.send({
    item: item,
    success: true
  });
});

// delete entire list
app.delete("/listings", function(request, response){
  listings = [];
  writeFile("data.txt", JSON.stringify(listings));
  response.send({
    listings: listings,
    success: true
  });
});

// delete one item
app.delete("/listings/:id", function(request, response){
  var id = request.params.id;
  var old = listings[id];
  listings.splice(id, 1);
  writeFile("data.txt", JSON.stringify(listings));
  response.send({
    listings: old,
    success: (old !== undefined)
  });
});

// This is for serving files in the static directory
app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});


function initServer() {
  // When we start the server, we must load the stored data
  var defaultList = "[]";
  readFile("data.txt", defaultList, function(err, data) {
    listings = JSON.parse(data);
  });
}

// var io = require("socket.io").listen(5555);

// Finally, initialize the server, then activate the server at port 8889
initServer();
// app.listen(5555);
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(5555)

/************* auto open window *************/
// setTimeout(function() {
//  var spawn = require('child_process').spawn
//  spawn('open', ['http://localhost:5555']);
// }, 500);



// exports.init = function(io) {
  var currentPlayers = 0;
  var playerList = [];
  var upTilt = 0;
  // var phone = new Object({posX:0, posY:0,posZ:0});

  io.sockets.on('connection', function (socket) {
    ++currentPlayers;
    socket.emit('players', { number: currentPlayers});
    socket.broadcast.emit('players', { number: currentPlayers});
    
    socket.on('disconnect', function () {
      --currentPlayers;
      socket.broadcast.emit('players', { number: currentPlayers});
    });
    
    socket.on('playerNameAdded', function (data) {
        playerList.push(data.playerName);
      console.log("emitted from client");
      socket.emit('playerNameUpdate', { listOfPlayers: playerList});
      socket.broadcast.emit('playerNameUpdate', { listOfPlayers: playerList});
    });

    // socket.emit('tiltUp', { upTilt: upTilt});
    // socket.broadcast.emit('tiltUp', { upTilt: upTilt});
    socket.on('change', function (data) {
      // playerList.push(data.playerName);
      console.log("change in server");
      console.log(data);
      socket.emit('phoneDataUpdateOnPage', { phone: data});
      socket.broadcast.emit('phoneDataUpdateOnPage', { phone: data});
    });

  }); 
// }

// console.log(io)
  // var socket = io.connect('/');

