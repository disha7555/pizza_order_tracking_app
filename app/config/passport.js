const LocalStrategy=require('passport-local').Strategy
const User=require('../models/user');
const bcryptjs=require("bcryptjs");

function init(passport){
    passport.use(new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
        //login
        //check if email exists
        const user = await User.findOne({email:email});
        if(!user){
            return done(null,false,{message:'No User with this email'});
        };
        bcryptjs.compare(password,user.password).then(match=>{
            if(match){
                return done(null,user,{message:'Logged in successfully'});
            }
            else {
            return done(null, false, { message: 'Wrong username or password' });
        }
        }).catch(err=>{
            return done(null,false,{message:'Something went wrong'});
        });

    }));
    //serialize is for storing data in session and deserialize is for getting data from session
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });
    passport.deserializeUser(async(id,done)=>{
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

}
module.exports=init