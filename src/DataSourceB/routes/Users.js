const router = require('express').Router();
var fs = require('fs');
var csvWriter = require('csv-write-stream')
const { v4: uuidv4 } = require('uuid');
const { google } = require("googleapis");
require('dotenv').config()








//get customer
router.get('/',async(req,res)=>{

  const auth = new google.auth.GoogleAuth({
    keyFile: "./key.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
  });
  
  const authClientObject = await auth.getClient();
  
  const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
  

  
     try{
     const response =  await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId:process.env.SHEET_ID, //spreadsheet id
        range: `${process.env.SHEET_NAME}!A:C`, //sheet name and range of cells
       
    })
    res.status(200).json({message:"succsessfully got data", data:response.data})
    // console.log(response)
       
     }catch(err){
         console.log(err)
         if(err.code == 11000){
            res.status(409).json({message:"user Already exists"})
         }else{
            res.status(500).json({message:"internal server error"})
         }
       
     }


})

//create new user
router.post('/create',async(req,res)=>{

  const auth = new google.auth.GoogleAuth({
    keyFile: "./key.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
  });
  
  const authClientObject = await auth.getClient();
  
  const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
  

    let customerDetails = req.body.customerDetails
     try{
      await googleSheetsInstance.spreadsheets.values.append({
        auth, //auth object
        spreadsheetId:process.env.SHEET_ID, //spreadsheet id
        range: `${process.env.SHEET_NAME}!A:C`, //sheet name and range of cells
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values: [[uuidv4(),customerDetails.name,customerDetails.email]],
        },
    });
         res.status(200).json({message:"succsessfully created new user",customerDetails})
     }catch(err){
         console.log(err)
         if(err.code == 11000){
            res.status(409).json({message:"user Already exists"})
         }else{
            res.status(500).json({message:"internal server error"})
         }
       
     }
})

//update user
router.put('/',async(req,res)=>{
    try{
        
       
        const customer = await UserModel.findOneAndUpdate({email:req.body.customerDetails.email},req.body.customerDetails,{
            new: true,
            upsert: true // Make this update into an upsert
          })
      
        res.status(200).json({message:"succsessfully update new customer",customer})
    }catch(err){
      res.status(500).json({message:"internal server error"})
      console.log(err)
    }
})

//delete user
router.delete('/:id',async(req,res)=>{
  try{
       await UserModel.findByIdAndDelete(req.params.id)
       res.status(200).json({message:"customer deleted succesfully"})
  }catch(err){
       res.status(500).json({message:"internal server error"})
  }
})


 const getAllUsers = async()=>{
  const users = [];
 
  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', function (row) {
  
      
      
      const user = {
          username:row.username,
          email:row.email
      }
      users.push(user)
    })
    .on('end', function () {
        console.table(users)
        return users
        // TODO: SAVE users data to another file
      })
}

// const addUser = async(user)=>{
//   if (!fs.existsSync("users.csv"))
//   writer = csvWriter({ headers: ["id", "name","email"],sendHeaders: true});
// else
//   writer = csvWriter({sendHeaders: false});

// writer.pipe(fs.createWriteStream("users.csv", {flags: 'a'}));
// writer.write({
//   id:user.id,
//   name:user.name,
//   email:user.email,
// });
// writer.end();
// }



module.exports = router