const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

// signup route
router
    .route("/signup")
    .get( userController.renderSignUpForm )
    .post( wrapAsync(userController.signUp))

// login route
router
    .route("/login")
    .get(userController.renderLogInForm)
    .post( 
    saveRedirectUrl, // call before passport because it resets the changes in current session
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    userController.logIn    
)

router.get("/logout", userController.logOut);

module.exports = router;