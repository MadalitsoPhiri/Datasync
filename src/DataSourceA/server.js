const express = require('express')
const mongoose = require('mongoose');
const UsersRoute = require('./routes/Users')
require('dotenv').config()
var app = express();  
var server = require('http').createServer(app); 

const uri = process.env.ATLAS_URI;
const PORT = process.env.PORT || 5000  


try{
  mongoose.connect(uri);   
}catch(err){
console.log(err)
}

const connection = mongoose.connection
connection.once('open',()=>{
  console.log("MongoDb connected!")
  server.listen(PORT,()=>{
    console.log('express server runing')
  });
})





app.use(express.json())
app.use('/api/users',UsersRoute)