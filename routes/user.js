const express=require('express');
const router=express.Router();



const {requireSignin}=require('../controllers/auth');
const {userByID}=require('../controllers/auth');





router.get('/secret/:userId',requireSignin,
(req,res)=>{
    res.json({
        user:req.profile
    })
})
// 
router.param('userId',userByID)


module.exports=router;