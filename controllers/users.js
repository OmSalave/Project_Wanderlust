const User = require("../models/user.js");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
} 

module.exports.signUp = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser =  await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Wellcome to Wanderlust");
            res.redirect("/listings")
        }) 
    }catch(e){
        req.flash("error", `${e.message}`)
        res.redirect("/signup")
    }
}

module.exports.renderLogInForm =  (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logIn = async(req,res)=>{
    req.flash("success","Wellcome back to Wanderlust")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl) // session delete by the passport 
}

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next();
        }
        req.flash("success", "User is logged out.");
        res.redirect("/listings")
    })
}