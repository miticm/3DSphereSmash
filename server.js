const express = require('express');
let app = express();
app.use(express.static("src"));
app.get('/',(req,res)=>{
  res.sendfile("./src/index.html");
})
app.listen(8888, () => {
  console.log("http://localhost:8888");
});