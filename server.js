const express = require('express');
const socketio = require("socket.io");
let players = [];

const app = express();
app.use(express.static("src"));
app.get('/',(req,res)=>{
  res.sendfile("./src/index.html");
})
const server = app.listen(8888, () => {
  console.log("http://localhost:8888");
});

const io = socketio(server);

io.on("connect",socket=>{
  console.log(`Connected with ${socket.id}`);
  let me = new player();
  players.push(me);
  let pIndex = players.length - 1

  socket.emit('connected',{
    index: pIndex
  })

  if(io.engine.clientsCount == 2){
    io.sockets.emit("start");
  }

  socket.on("disconnect",()=>{
    console.log(`Disconnected with ${socket.id}`)
    players.splice(pIndex,1);
  })

  socket.on('speed',data=>{
    players[0].speed = data[0];
    players[1].speed = data[1];
    io.sockets.emit("update",{
      players
    })
  })

})

class player {
  constructor(){
    this.speed = {x:0,y:0,z:0};
  }
}