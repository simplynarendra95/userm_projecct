"use strict";

const bcrypt = require("bcrypt");

const securePassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

// module.securePassword = async (password) => {
//     try {
//         // return the promises.
//         const hashedPassword = await bcrypt.hash(password, 10);
//         return hashedPassword;
//     } catch (error) {
//         console.log("secure.password.js/error ", error.message);
//     }
// }

const comparePassword = async (password, data) => {
    const matchPassword = await bcrypt.compare(password, data);
    return matchPassword;
}


module.exports = {
    securePassword,
    comparePassword
};