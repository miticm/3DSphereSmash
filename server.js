const express = require('express');
const socketio = require("socket.io");

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

  socket.on("disconnect",()=>{
    console.log(`Disconnected with ${socket.id}`)
  })
})