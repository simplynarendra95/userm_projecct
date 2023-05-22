"use strict";

require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Here we send the email to the user.
 */
const sendVerifyMail = async (name, email, user_id) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: `${process.env.useremail}`,
            pass: `${process.env.SECRET}`,
        },
        // auth: {
        //     user: "info95narendray@gmail.com", // generated ethereal user
        //     pass: "nrbgaqedmquptdlc", // generated ethereal password
        // },
    });

    // send mail with defined transport object
    let info = {
        from: "info95narendray@gmail.com", // sender address
        to: email, // list of receivers
        subject: "For Verification Mail ✔", // Subject line
        text: "Hello world?", // plain text body
        html: '<p>Hello' + name + ', please click here to <a href = "http://127.0.0.1:3000/verify?id=' + user_id + '"> Verify</a> your mail </p>', // html body
    }

    transporter.sendMail(info, function (err, info) {
        if (err) {
            console.log("./helper/email.config.js error 38", err);
        } else {
            console.log("Email has been send - ", info.response);
        }
    });
}


/**
 * Here we create a function for reset the email password.
 */
const sendResetPasswordMail = async (name, email, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: `${process.env.useremail}`,
            pass: `${process.env.SECRET}`,
        }
    });

    // send mail with defined transport object
    let info = {
        from: "info95narendray@gmail.com", // sender address
        to: email, // list of receivers
        subject: "For Reset Password Mail ✔", // Subject line
        text: "Hello world?", // plain text body
        html: '<p>Hello' + name + ', please click here to <a href = "http://127.0.0.1:3000/forget-password?token=' + token + '"> Forget </a> Password </p>', // html body
    }

    transporter.sendMail(info, function (err, info) {
        if (err) {
            console.log("./helper/email.config.js error 71", err);
        } else {
            console.log("Email has been send - ", info.response);
        }
    });
}

/**
 * This is used for admin/forget-password.
 */
const sendResetAdminPasswordMail = async (name, email, token) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: `${process.env.useremail}`,
            pass: `${process.env.SECRET}`,
        }
    });

    // send mail with defined transport object
    let info = {
        from: "info95narendray@gmail.com", // sender address
        to: email, // list of receivers
        subject: "For Reset Password Mail ✔", // Subject line
        text: "Hello world?", // plain text body
        html: '<p>Hello' + name + ', please click here to <a href = "http://127.0.0.1:3000/admin/forget-password?token=' + token + '"> Forget </a> Password </p>', // html body
    }

    transporter.sendMail(info, function (err, info) {
        if (err) {
            console.log("./helper/email.config.js error 71", err);
        } else {
            console.log("Email has been send - ", info.response);
        }
    });
}

/**
 * Here we use this function for when we create a newUser and this 
 * function send password to the user given email during registration time.
 */
const addNewUser = async (name, email, password, user_id) => {
    console.log("object addNewUser");
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth: {
                user: `${process.env.useremail}`,
                pass: `${process.env.SECRET}`,
            }
        });
        // send mail with defined transport object
        let info = {
            from: "info95narendray@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Admin add User and Verify the your email ✔", // Subject line
            text: "Hello world?", // plain text body
            html: '<p>Hi'  + ' ' + name + ', please click here to <a href = "http://127.0.0.1:3000/verify?id=' + user_id + '"> Verify </a> your mail. </p> <br> <b>Email: -</b>' +email+ '<br><b>Password: - <b>' + password + '' , // html body
        }

        transporter.sendMail(info, function (err, info) {
            if (err) {
                console.log("./helper/email.config.js error 71", err);
            } else {
                console.log("Email has been send - ", info.response);
            }
        });

    } catch (error) {
        console.log("Email has been send -  146", error.message);
    }
}

module.exports = {
    sendVerifyMail,
    sendResetPasswordMail,
    sendResetAdminPasswordMail,
    addNewUser
};