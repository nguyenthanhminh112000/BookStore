const User=require('../models/user');


// take id from auth route
exports.userByID=(req,res,next,id)=>{
    // find user
    User.findById(id).exec((err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:'User not found'
            })
        }
        req.profile=user;
        next();
    })
}