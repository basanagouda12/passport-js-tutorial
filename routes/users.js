const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//user model
const User = require('../models/User');
const passport=require('passport');

router.get('/login',(req,res) => res.render('login'));


router.get('/register',(req,res) => res.render('register'));

//register handle
router.post('/register',(req,res)=>{
    const { name,email,password,password2}=req.body;
    let error= [];

    //check ||
    if(!name || !email || !password || !password2){
        error.push({msg: 'please fill all fields'});
    }


    //password
    if(password != password2) {
        error.push({msg:'password did not match'});

    }

    //check pass len
    if(password.length < 6) {

        error.push({msg:'password should be 6 chars'});
    }

    if(error.length > 0){
        console.log(error);
        res.render('register',{
            error,
            name,
            email,
            password,
            password2

        });
    }else{
        //validation  passed
        User.findOne({ email :email})
        .then(user => {
            if(user) {
                error.push({msg:'Email is already exists'})
                res.render('register',{
                    error,
                    name,
                    email,
                    password,
                    password2
    
                });
            //

            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // console.log(newUser)
                // res.send("hello");
                bcrypt.genSalt(10,(err,salt) =>
                bcrypt.hash(newUser.password,salt,(err,hash) => {
                    if(err) throw err;
                    //set password hash
                    newUser.password=hash;
                    //save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg','you are registered and you can log in');
                        res.redirect('login');
                    })
                    .catch(err => console.log(err));
                }))
            }
        });
    }
});


//login handel

router.post('/login',(req,res,next)=> {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);

});


//logout handel

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged Out');
    res.redirect('/users/login');

})
module.exports=router;