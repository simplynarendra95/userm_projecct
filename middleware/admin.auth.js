// "use strict";

const isAdminLogin = async (req, res, next) => {
    try {
        // console.log("object isLogin", req.session.userId)
        if (req.session.adminId) {
            // console.log("req.session.userId", req.session.userId)
        } else {
            return res.redirect('/admin');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isAdminLogOut = async (req, res, next) => {
    try {
        // console.log(" isLogout 18")
        // console.log("object isLogout", req.session.userId)
        if (req.session.adminId) {
            // console.log(" isLogout 20")
            return res.redirect('/admin/home');
        } 
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isAdminLogin,
    isAdminLogOut
};