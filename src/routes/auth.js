const router = require("express").Router();
const User = require("../modules/User")
const bcrypt = require('bcrypt')
// POST ==> CREATE
// PUT ====> UPDATE
// DELETE====>DELETE
// GET ======> GET

// REGISTER
router.post("/register",async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password,salt)
       const newUser = new User({
        // req.body (it will take everything)
        username:req.body.username,
        email:req.body.email,
        password:hashedPass
       })
       const user = await newUser.save();
       res.status(200).json(user)
    } catch(err){
         res.status(500).json(err)
    }
})
// LOGIN 
router.post("/login",async (req,res) =>{
  try{
     const user = await User.findOne({username:req.body.username})
     !user&&res.status(400).json("wrong credentials!")
     const validate = await bcrypt.compare(req.body.password,user.password)
     !validate&&res.status(400).json("wrong credentials")
     const {password,...other}= user._doc
     res.status(200).json(other)
  } catch(err){
    res.status(500).json(err)
  }
})
module.exports = router


