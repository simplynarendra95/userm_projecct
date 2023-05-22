// "use strict";

const isLogin = async (req, res, next) => {
    try {
        // console.log("object isLogin", req.session.userId)
        if (req.session.userId) {
            // console.log("req.session.userId", req.session.userId)
        } else {
            return res.redirect('/');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLogOut = async (req, res, next) => {
    try {
        // console.log(" isLogout 18")
        // console.log("object isLogout", req.session.userId)
        if (req.session.userId) {
            // console.log(" isLogout 20")
            return res.redirect('/home');
        } 
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogOut
};