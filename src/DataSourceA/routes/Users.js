const router = require('express').Router();
const UserModel = require('../models/User');
const { v4: uuidv4 } = require('uuid');

//get user
router.get('/:id',async(req,res)=>{
try{
const customer = await UserModel.findById(req.params.id)
if(customer != null){
    res.status(200).json({message:"found one record succsessfuly",customer})
}else{
    res.status(404).json({message:"no record found"})
}

}catch(err){
res.status(500).json({message:"internal server error"})
}
})

//create new user
router.post('/create',async(req,res)=>{
    let customerDetails = req.body.customerDetails
     try{
         const user = await  new UserModel({...customerDetails,_id:uuidv4()})
         await user.save()
       
         res.status(200).json({message:"succsessfully created new user",user})
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
router.put('/:id',async(req,res)=>{
  const {name, email} = req.body.customerDetails
    try{
        
       
        const customer = await UserModel.findOneAndUpdate({_id:req.params.id},{name,email},{
          
            upsert: true // Make this update into an upsert
          })
      
        res.status(200).json({message:"succsessfully updated user",customer})
    }catch(err){
      res.status(500).json({message:"internal server error"})
      console.log(err)
    }
})





module.exports = router