const express = require('express');
const socketio = require("socket.io");
const _ = require("underscore");
const mongoose = require('mongoose');

// DB credentials
const mongoDB = 'mongodb://demoman:demoman234@ds044907.mlab.com:44907/3dspheresmash'

let players = [];
let pendings = [];
let matches = {};

const app = express();
app.use(express.static("src"));

app.get('/',(req,res)=>{
  res.sendfile("./src/index.html");
});

app.get('/play', (req, res) => {
  res.sendfile("./src/play.html");
});

const server = app.listen(8888, () => {
  console.log("http://localhost:8888");
});

// configure mongoose
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDB, { useNewUrlParser: true })
  .then(connection => {
      console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log(error.message)
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// get models & create
require('./src/models/SiteAnalytics');
const SiteAnalytics = mongoose.model('SiteAnalytics', SiteAnalytics);
let currentAnalytics = new SiteAnalytics({ createdAt: Date.now() });
currentAnalytics.save((err) => {
  if(err) return handleError(err);
})

const io = socketio(server);

io.on("connect", socket => {
  socket.on('new player', (username) => {
    console.log(`Connected with ${socket.id}`);
    let me = new player(socket.id, socket, 0, 1, username, Date.now());
    players.push(me);
    let opponent = {};

    connectPlayers(me, opponent);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected with ${socket.id}`);

    if (matches[opponent.id] && matches[me.id]) {
      console.log(matches[opponent.id]);
      console.log(matches[me.id]);
      delete matches[opponent.id];
      delete matches[me.id];

      opponent.socket.emit("findNew");
    }

    players = _.without(players, me);
    pendings = _.without(pendings, me.id);
    console.log(pendings);
  });

  socket.on("findNew", () => {
    opponent = {};
    console.log("here");
    connectPlayers(me, opponent);
  });

  socket.on('speed', data => {
    if (!opponent || (Object.keys(opponent).length === 0 && opponent.constructor === Object)) {
      opponent = playerById(matches[me.id]);
    }

    if (Object.keys(opponent).length !== 0) {
      me.speed = data[me.pIndex];
      opponent.speed = data[me.p2Index];
      me.socket.emit("update", {
        me: {speed: me.speed},
        opponent: {speed: opponent.speed}
      });
      opponent.socket.emit("update", {
        me: {speed: opponent.speed},
        opponent: {speed: me.speed}
      });
    }
  });

});

class player {
  constructor(id, socket, pIndex, p2Index, username, startTime) {
    this.speed = {x: 0, y:0, z:0};
    this.id = id;
    this.socket = socket;
    this.pIndex = pIndex;
    this.p2Index = p2Index;
    this.username = username;
    this.startTime = startTime;
  }
}

function connectPlayers(me, opponent) {
  var id = _.sample(pendings);

  if (id) {
    me.pIndex = 1;
    me.p2Index = 0;
  }
  else {
    me.pIndex = 0;
    me.p2Index = 1;
  }

  me.socket.emit('connected',{
    index: me.pIndex
  });

  if (!id) {
    console.log("added " + me.id + " to pending");
    pendings.push(me.id);
    me.socket.emit("pending", {status: "pending", message: "Waiting for a new player."});
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
}

function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
      if (players[i].id == id)
          return players[i];
  };

  return {};
}
