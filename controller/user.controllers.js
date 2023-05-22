"use strict";

const User = require("../models/user.js");
const { securePassword, comparePassword } = require("../helper/secure.password.js");
const { sendVerifyMail, sendResetPasswordMail } = require("../helper/email.config.js");
const randomstring = require("randomstring");


/**
 * Here we show the login page controller.
 */
const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        return res.status(501).json({
            status: "Failed",
            message: error.message
        });
    }
};

/**
 * Here we insert/register a user data using a post api. 
 * and we send an email to the user mail for verify that.
 */
const insertData = async (req, res) => {
    try {
        // console.log("object", req.body)
        const checkemail = await User.findOne({ email: req.body.email });
        // console.log("object checkemail", checkemail);
        if (checkemail) {
            res.render("registration", {
                message: "User Exist..."
            });
        } else {
            const spassword = await securePassword(req.body.password);
            const createUser = await User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                image: req.file.filename,
                password: spassword,
                is_Admin: 0
            });
            const savedUser = await createUser.save();
            console.log("object savedUser", savedUser);
            if (savedUser) {
                sendVerifyMail(req.body.name, req.body.email, savedUser._id);
                return res.render("registration"), {
                    message: "Your regestration has been successfully, please verify the your email."
                }
            } else {
                return res.render("registration"), {
                    message: "Your regestration has not been successfully."
                }
            }
        }
    } catch (error) {
        return res.render(
            'registration',
            {
                message: error.message
                // message: "Your regestration has been failed.."
            });
    }
}

/**
 * here we create function for verify the email.
 */
const verifyMail = async (req, res) => {
    try {
        // const updatedInfo = await User.updateOne({
        //     _id: req.query.id
        // }, {
        //     $set: {
        //         // is_Verified
        //         is_Verified: 1
        //     }
        // });

        const id = req.query.id;
        // User.findByIdAndUpdate(user_id, { name: 'Gourav' },
        //     function (err, docs) {
        //         if (err) {
        //             console.log(err)
        //         }
        //         else {
        //             console.log("Updated User : ", docs);
        //         }
        //     });


        const updatedInfo = await User.findByIdAndUpdate(
            id,
            { is_Verified: 1 }
        )

        if (updatedInfo) {
            res.render("email_verified");
        } else {
            res.render("error");
        }
    } catch (error) {
        console.log("verifyMail Error -- ", error);
    }
}

/**
 * Here we create function for user login
 */
const loadlogin = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log("Error-login", error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkemail = await User.findOne({ email: email });
        if (checkemail !== null) {
            const checkPassword = await comparePassword(password, checkemail.password);
            if (checkPassword == true) {
                if (checkemail.is_Verified === '0') {
                    res.render("login", { message: "Please verify the email.." });
                } else {
                    // req.session.key = "value"
                    req.session.userId = checkemail._id;
                    res.redirect(301, "/home");
                    // res.redirect("home", {user: checkemail});
                }
            } else {
                res.render("login", { message: "Email or Password are InValid..." });
            }
        } else {
            // console.log("Not found")
            res.render("login", { message: "Email or Password are InValid..." });
        }
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * 
 */
const loadhome = async (req, res) => {
    try {
        // here we
        // req.session.userName = 'Aditya@123';
        const id = req.session.userId;
        // console.log("object id", id);
        const userData = await User.findById(id);
        // console.log("object userData", userData)

        return res.render("home", { user: userData });
        // return res.render("home");
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * get All users.
 */
const getAllUser = async (req, res) => {
    try {
        const get = await User.find();
        res.send({
            status: "success",
            data: get
        });
    } catch (error) {
        console.log("object", error.message);
    }
}

const findUserByEmail = async (req, res) => {
    try {
        const userd = await User.findOne({ email: "manager12@yopmail.com" });
        console.log("userd", userd);
    } catch (error) {
        console.log("err", error.message);
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log("Error -- ", error.message);
    }
}

/**
 * delete the email
 */
const deleteEMail = async (req, res) => {
    try {
        // const id = "6404de59f9c35cc8f8a71ac8";
        // const id = "6404ec723c63c2dacc2fa2be";
        const id = "63fa1c7f6e2fbdc3b7553b1f";
        const email = await User.deleteOne({ _id: id });
        if (email) {
            return res.status(200).send("Email");
            // return res.send("Email", email);
        } else {
            return res.status(200).send("Else Email");
            // return res.send("Else Email", email);
        }
    } catch (error) {
        return console.error("deleteEMail error", error.message);
    }
}

/**
 * Here we create controller for forget the password.
 */
const forgetPassword = async (req, res) => {
    try {
        return res.render("forget")
    } catch (error) {
        console.log("error", error.message);
    }
}

/**
 * 
 */
const forgetVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await User.findOne({ email: email });
        if (userData !== null) {
            if (userData.is_Verified === '0') {
                return res.render("forget", { message: "Please verify the email.." })
            } else {
                const randomstr = randomstring.generate();
                const updateUser = await User.updateOne(
                    { email: email },
                    {
                        $set: { token: randomstr }
                    }
                );
                sendResetPasswordMail(updateUser.name, email, randomstr);
                return res.render("forget", { message: "Please check your mail to reset your password" })
            }
        } else {
            return res.render("forget", { message: "User Email is Incorrect..." });
            // console.log("userData else", userData);
        }
    } catch (error) {
        console.log("error", error.message);
    }
}

/**
 * 
 */
const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const userToken = await User.findOne({ token: token });
        if (userToken) {
            return res.render("forget-password", { user_id: userToken._id });
        } else {
            return res.render("404", { "message": "Token is an invalid" });
        }
    } catch (error) {
        console.log("forgetPasswordLoad", error.message);
    }
}

/**
 * We Reset Password and then empty the token from user table.
 */
const resetPassword = async (req, res) => {
    try {
        const { user_id, oldpass, newpassword } = req.body;
        // const oldpass = "123456";
        // const user_id = "640610956374d257eba21b5e";
        const checkUser = await User.findById(user_id);
        const oldPassword = await comparePassword(oldpass, checkUser.password);
        // $2b$10$/EkF7uLzVg8IK.005eY2i.d4h2D5ltX6j3VdO9Fl7amGi1AtDl4Se
        // $2b$10$/EkF7uLzVg8IK.005eY2i.d4h2D5ltX6j3VdO9Fl7amGi1AtDl4Se password old
        if (oldPassword === true) {
            console.log("object oldPassword", oldPassword);
            const spassword = await securePassword(newpassword);
            const updatePassword = await User.findByIdAndUpdate({ _id: user_id }, {
                password: spassword,
                token: ''
            });
            if (updatePassword) {
                console.log("object password updated successfully ....")
                return res.redirect("/")
            } else {
                return res.render("forget-password", { message: "Password not updated" })
            }
        } else {
            console.log("object");
            return res.render("forget-password", { message: "Password not matched" })
        }
    } catch (error) {
        console.log("object resetPassword error ***", error.message);
    }
}

/**
 * 
 * @param {email} req 
 * @param {*} res  
 * @returns send email verification link
 */
const verificationLoad = async (req, res) => {
    try {
        return res.render("verification");
    } catch (error) {
        console.log("emailVerify *****", error.message);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns
 */
const sentverificationLink = async (req, res) => {
    try {
        const { email } = req.body;
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail) {
            console.log("object", checkEmail);
            if (checkEmail.is_Verified === '1') {
                return res.render("verification", { message: "Email Already Verified" });
            } else {
                await sendVerifyMail(checkEmail.name, email, checkEmail._id);
                return res.render("verification", { message: "Reset verification email sent your email address, please check email.." })
            }
            // console.log("object", checkEmail.name)
            // console.log("object", checkEmail.email)
            // console.log("object", checkEmail._id)
        } else {
            return res.render("verification", { message: "Email does not exist in DB.." })
        }
    } catch (error) {

    }
}

/**
 * User Profile edit and Update
 */
const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            return res.render("edit", { user: userData });
        } else {
            return res.redirect("/home");
        }
    } catch (error) {
        console.log("object editLoad", error.message);
    }
}

// updateProfile
const updateProfile = async (req, res) => {
    try {
        const { user_id, name, email, mno,  is_Admin} = req.body;
        if (req.file) {
            const userData = await User.findByIdAndUpdate({ _id: user_id }, {
                name: name, email: email, mobile: mno, image: req.file.filename, is_Admin: is_Admin 
            });
        } else {
            const userData = await User.findByIdAndUpdate({ _id: user_id }, {
                name: name, email: email, mobile: mno, is_Admin: is_Admin
            });
        }
        return res.redirect('/home');
    } catch (error) {
        console.log("object updateProfile", error.message);
    }
}

module.exports = {
    loadRegister,
    insertData,
    verifyMail,
    loadlogin,
    verifyLogin,
    loadhome,
    getAllUser,
    findUserByEmail,
    userLogout,
    deleteEMail,
    forgetPassword,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sentverificationLink,
    editLoad,
    updateProfile
}