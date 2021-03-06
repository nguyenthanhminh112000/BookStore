const User=require('../models/user')
const jwt=require('jsonwebtoken');// to generate signed token

const expressJwt=require('express-jwt'); // for authorization check
const {errorHandler}=require('../helpers/dbErrorHandler');

exports.signup=(req,res)=>{
    console.log("req.body",req.body);
    const user =new User(req.body);

    // save the sign up to the database
    user.save((error,user)=>{
        if(error){
            return res.status(400).json({error:errorHandler(error)});
        }
        // 
        user.salt=undefined;
        user.hashed_password=undefined;
        res.json({
            user
        })
    }) 
}


exports.signin=(req,res)=>{
    //find the user base on email
    const {email,password}=req.body;
    User.findOne({email},(err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:'User with that email does not exist. Please sign up'
            })
        }
        // if user is found make sure the email 
        // and password match
        // create authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:'Email and password don\'t match'
            })
        }

        // generate a signed token with user id and secret
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
        // persist the token as 't' in cookie with expiry date
        res.cookie('t',token,{expire:new Date()+9999})
        // return respond with user and token to the frontend client
        const {_id,name,email,role}=user;
        return res.json({token,user:{_id,name,email,role}});

    })
}

exports.signout=(req,res)=>{
    // sign out we need to clear a cookie
    res.clearCookie('t');
    res.json({message:"Sign out success"});
}


// use as middleware to protect the signed in
exports.requireSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty:"auth"
})