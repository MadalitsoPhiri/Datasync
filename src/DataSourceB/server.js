const express = require('express')
const mongoose = require('mongoose');
const UsersRoute = require('./routes/Users')
require('dotenv').config()
var app = express();  
var server = require('http').createServer(app); 
var fs = require('fs');
var csvWriter = require('csv-write-stream')

const uri = process.env.ATLAS_URI;
const PORT = process.env.PORT || 5000  

server.listen(PORT,()=>{
  console.log('express server runing')
});


// const addUser = async(user)=>{
//   if (!fs.existsSync("users.csv"))
//   writer = csvWriter({ headers: ["id", "username","email"],sendHeaders: true});
// else
//   writer = csvWriter({sendHeaders: false});

// writer.pipe(fs.createWriteStream("users.csv", {flags: 'a'}));
// writer.write({
//   id:user.id,
//   username:user.username,
//   email:user.email,
// });
// writer.end();
// }

// addUser({id:"1",username:"Madalitso",email:"Madalitso.phiri150@gmail.com"})




app.use(express.json())
app.use('/api/users',UsersRoute)