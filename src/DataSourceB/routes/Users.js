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
  const {customerDetails,range} = req.body
  if(!customerDetails || !range){
    //bad request
    res.status(400).json({message:"The request is invalid"})
    return
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "./key.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
  });
  
  const authClientObject = await auth.getClient();
  
  const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
  


     try{
      await googleSheetsInstance.spreadsheets.values.update({
        auth, //auth object
        spreadsheetId:process.env.SHEET_ID, //spreadsheet id
        range: `${process.env.SHEET_NAME}!B${range.row}:C${range.row}`, //sheet name and range of cells
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[customerDetails.name,customerDetails.email]],
        },
    });
         res.status(200).json({message:"succsessfully updated user",customerDetails})
     }catch(err){
         console.log(err)
         if(err.code == 11000){
            res.status(409).json({message:"user Already exists"})
         }else{
            res.status(500).json({message:"internal server error"})
         }
       
     }
  
})









module.exports = router