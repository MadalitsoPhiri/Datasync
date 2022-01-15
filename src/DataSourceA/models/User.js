const mongoose = require('mongoose');




const UserSchema = new mongoose.Schema({
    _id:{type:String},
    name:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    email:{
        type:String,
        required:true,
        max:50,
    },
   
    
},
{
    timestamps:true,
    _id:false
}
);

module.exports = mongoose.model("Users",UserSchema);