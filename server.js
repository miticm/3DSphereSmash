const express = require('express');
const socketio = require("socket.io");
const _ = require("underscore");
let players = [];
let pendings = [];
let matches = {};

const app = express();
app.use(express.static("src"));

app.get('/',(req,res)=>{
  res.sendfile("./src/index.html");
});

const server = app.listen(8888, () => {
  console.log("http://localhost:8888");
});

const io = socketio(server);

io.on("connect", socket => {
  console.log(`Connected with ${socket.id}`);
  let me = new player(socket.id, socket);
  players.push(me);
  let opponent = {};

  var id = _.sample(pendings);
  let pIndex = 0;
  let p2Index = 1;

  if (id) {
    pIndex = 1;
    p2Index = 0;
  }

  socket.emit('connected',{
    index: pIndex
  });

  if (!id) {
    console.log("added " + me.id + " to pending");
    pendings.push(me.id);
    me.socket.emit("pending", {status: "pending", message: "waiting for a new player."});
  }
  else {
    pendings = _.without(pendings, id);
    matches[id] = me.id;
    matches[me.id] = id;
    console.log(matches);
    opponent = playerById(id);
    me.socket.emit("start");
    opponent.socket.emit("start");
  }

  socket.on("disconnect", () => {
    console.log(`Disconnected with ${socket.id}`);
  });

  socket.on('speed', data => {
    if (!opponent || (Object.keys(opponent).length === 0 && opponent.constructor === Object)) {
      opponent = playerById(matches[me.id]);
    }

    me.speed = data[pIndex];
    opponent.speed = data[p2Index];
    me.socket.emit("update", {
      me: {speed: me.speed},
      opponent: {speed: opponent.speed}
    });
    opponent.socket.emit("update", {
      me: {speed: opponent.speed},
      opponent: {speed: me.speed}
    });
  });

});

class player {
  constructor(id, socket) {
    this.speed = {x: 0, y:0, z:0};
    this.id = id;
    this.socket = socket;
  }
}

function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
      if (players[i].id == id)
          return players[i];
  };
  
  return {};
}