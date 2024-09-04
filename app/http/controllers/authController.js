const User=require("../../models/user");
const bcryptjs=require("bcryptjs");
const passport = require('passport');


function authController(){
    return{
        login(req,res){
            res.render('auth/login');
        },
        postLogin(req,res,next){
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error','An error occurred during login');
                    return next(err);
                };
                if(!user){
                    req.flash('error',info.message);
                   return res.redirect('/login');
                };
                 req.logIn(user,(err)=>{
                    if(err){
                        req.flash('error','Failed to log in user');
                        return next(err);
 

                    }
                    req.flash('success', 'Logged in successfully'); 
                    return res.redirect('/');
                });
            })(req,res,next);
        },
        register(req,res){
            res.render('auth/register');
        },
       async postRegister(req,res){
            const {name,email,password} = req.body;
            //validate req
            if(!name || !email || !password){
                req.flash('error','All fields are required');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('./register');
            }

            // //check if email exists
            // const exists = await User.exists({ email: email });
            // if (exists) {
            //     req.flash('error', 'Email is already taken');
            //     req.flash('name', name);
            //     req.flash('email', email);
            //     return res.redirect('./register');
            // }

            // //hashing paasword
            // const hashedPassword=await bcryptjs.hash(password,10);

            // //create a user
            // const user=new User({
            //     name:name,
            //     email:email,
            //     password:hashedPassword
            // })
            // user.save().then((user)=>{
            //     return res.redirect('/')
            // }).catch(err=>{
            //     req.flash('error','something went wrong');
            
            // });
            // console.log(req.body)

            //return res.redirect('./register');
            //}
    
            try {
                // Check if email exists
                const exists = await User.exists({ email: email });
                if (exists) {
                    req.flash('error', 'Email is already taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('./register');
                }
        
                // Hash password
                const hashedPassword = await bcryptjs.hash(password, 10);
        
                // Create a new user
                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword
                });
        
                await user.save();
        
                return res.redirect('/');
            } catch (err) {
                req.flash('error', 'Something went wrong');
                return res.redirect('./register');
            }
        },

        // logout(req,res){
        //     req.logout();
        //     res.redirect('/login');
        // }
        logout(req, res, next) {
            req.logout((err) => {
                if (err) {
                    req.flash('error', 'Error occurred while logging out');
                    return next(err);
                }
                req.flash('success', 'Logged out successfully');
                res.redirect('/login');
            });
        }
    };
}

module.exports=authController;