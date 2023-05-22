"use strict";

require('dotenv').config()
const express = require("express");
// const admin_router = express.Router();
const admin_router = express();

const bodyParser = require("body-parser");
const session = require("express-session");

admin_router.use(session({ secret: "D43JY/,cy7a&dJS]" }));

admin_router.use(bodyParser.json());
admin_router.use(bodyParser.urlencoded({ extended: true }));

admin_router.use(express.json());
// this is used whenever form data is coming.
admin_router.use(express.urlencoded({ extended: true }));

admin_router.set("view engine", "ejs");
admin_router.set("views", "./views/admin");

// this is used for fetch the images from the public folder.
admin_router.use("/public", express.static('public'));

const auth = require("../middleware/admin.auth.js");
const upload = require("../middleware/imageProcessing.js");

const adminController = require("../controller/admin.controller.js");

admin_router.get('/', auth.isAdminLogOut, adminController.loadLogin);
admin_router.post("/", auth.isAdminLogOut, adminController.verifyLogin);

admin_router.get("/home", auth.isAdminLogin, adminController.dashboard);
admin_router.get('/logout', auth.isAdminLogin, adminController.adminLogout);

admin_router.get('/forget', auth.isAdminLogOut, adminController.forgetLoad);
admin_router.post('/forget', auth.isAdminLogOut, adminController.forgetVerify);

admin_router.get('/forget-password', auth.isAdminLogOut, adminController.forgetPsswordLoad);
admin_router.post('/forget-password', auth.isAdminLogOut, adminController.resetPassword);

admin_router.get('/dashboard', auth.isAdminLogin, adminController.adminDashboard);

admin_router.get('/new-user', auth.isAdminLogin, adminController.newUserLoad);
admin_router.post('/new-user', upload.single('image'), adminController.addNewUserByAdmin);

admin_router.get('/edit-user', auth.isAdminLogin, adminController.loadEditUserPage);
admin_router.post('/edit-user', auth.isAdminLogin, upload.single('image') , adminController.editUserByAdmin);

admin_router.get('/export-users', auth.isAdminLogin, adminController.exportAllUsers);
admin_router.get('/pdf-users', auth.isAdminLogin, adminController.exportAllUsersPDF);

// if we type any unknown url then he redirect to the admin login url.
// admin_router.get("*", function (req, res) {
//     return res.redirect("/admin");
// });

module.exports = admin_router;