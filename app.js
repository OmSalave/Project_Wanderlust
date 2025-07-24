
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter =  require("./routes/review.js");
const userRouter = require("./routes/user.js");
const MongoStore = require("connect-mongo");


let ATLAS_URL = process.env.ATLASDB_URL 


main().then(
    console.log("database connected")
).catch(err => console.log(err));
async function main() {
  await mongoose.connect(ATLAS_URL);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);            // includes and partial
app.use(express.static(path.join(__dirname, "/public")));

let secret = process.env.SECRET

const store = MongoStore.create({
    mongoUrl: ATLAS_URL,
    crypto: {
        secret: secret,
    },
    touchAfter: 24 * 60 * 60,
})

store.on("error", ()=>{
    console.log("error in mongo store")
})

const sessionOptions = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge:  1000 * 60 * 60 * 24 * 3,
        httpOnly : true,
    }
};


// app.get("/", (req,res)=>{
//     res.send("working");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// listing
app.use("/listings", listingRouter)

// review
app.use("/listings/:id/reviews", reviewRouter)

// user
app.use("/", userRouter)

// page not found err if no matching request
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found."));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500, message="something went wrrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
})

app.listen(8080, ()=>{
    console.log("listerning on port 8080");
})



