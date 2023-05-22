"use strict";

require('dotenv').config()
const express = require("express");
// const user_router = express.Router();

// TypeError: user_router.set is not a function
// solution is -- const user_router = express();
const user_router = express();

const session = require("express-session");
const bodyParser = require("body-parser");

// this is used whenever req.body data is coming..
user_router.use(express.json());
user_router.set("view engine", "ejs");
user_router.set("views", "./views/user"); // this is used for user

user_router.use(bodyParser.json());
user_router.use(bodyParser.urlencoded({ extended: true }));

// this is used whenever form data is coming.
user_router.use(express.urlencoded({ extended: true }));

// router.use(express.session())
// router.set('trust proxy', 1) // trust first proxy
user_router.use(session({
    // name: `daffyduck`,
    secret: "D43JY/,cy7a&dJS]",
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: true },
    // store: store
}));

// this is used for fetch the images from the public folder.
user_router.use(express.static('public'));

const upload = require("../middleware/imageProcessing.js");
const userRegister = require("../controller/user.controllers.js");

const auth = require("../middleware/auth.js");

// resgiter routers
user_router.get("/register", auth.isLogOut, userRegister.loadRegister);
user_router.post("/register", auth.isLogOut, upload.single('image'), userRegister.insertData);

// email verify user_router.
user_router.get("/verify", userRegister.verifyMail);

// login routers
user_router.get('/', auth.isLogOut, userRegister.loadlogin);
user_router.get('/login', auth.isLogOut, userRegister.loadlogin);
user_router.post('/login', userRegister.verifyLogin);
user_router.get('/home', auth.isLogin, userRegister.loadhome);
user_router.get('/logout', auth.isLogin, userRegister.userLogout);

user_router.get("/forget",auth.isLogOut, userRegister.forgetPassword);
user_router.post("/forget",auth.isLogOut, userRegister.forgetVerify);

user_router.get("/forget-password", auth.isLogOut,userRegister.forgetPasswordLoad);
user_router.post("/forget-password",auth.isLogOut, userRegister.resetPassword);

user_router.get("/verification",auth.isLogOut, userRegister.verificationLoad);
user_router.post("/verification",auth.isLogOut, userRegister.sentverificationLink);

user_router.get("/edit", auth.isLogin, userRegister.editLoad);
user_router.post("/edit", auth.isLogin, upload.single('image'), userRegister.updateProfile);

// user_router.post('/byEmail', userRegister.findUserByEmail);


user_router.get('/getAllUser', userRegister.getAllUser);
user_router.get('/deleteEMail', userRegister.deleteEMail);


// if we type any unknown url then he redirect to the admin login url.
// user_router.get("*", function (req, res) {
//     return res.redirect("/login");
// });



module.exports = user_router;