"use strict";

const User = require("../models/user.js");
const { securePassword, comparePassword } = require("../helper/secure.password.js");
const { addNewUser, sendVerifyMail, sendResetAdminPasswordMail } = require("../helper/email.config.js");
const randomstring = require("randomstring");
const excelJs = require("exceljs")

// html-to-pdf convert
const ejs = require("ejs");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");



const loadLogin = async (req, res) => {
    try {
        return res.render('login')
    } catch (error) {
        console.log("object loadLogin Admin", error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminData = await User.findOne({ email: email });
        // console.log("object adminData", adminData);
        if (adminData) {
            const matchPassword = await comparePassword(password, adminData.password);
            if (matchPassword) {
                if (adminData.is_Admin !== "1") {
                    return res.render("login", { message: "Email Or Password is InCorrect .." })
                } else {
                    req.session.adminId = adminData._id;
                    return res.redirect("/admin/home");
                }
            } else {
                return res.render("login", { messge: "Email Or Password is InCorrect .." })
            }
        } else {
            return res.render("login", { messge: "Email Or Password is InCorrect .." })
        }
    } catch (error) {
        console.log("object verifyLogin Admin", error.message);
    }
}

const dashboard = async (req, res) => {
    try {
        const id = req.session.adminId;
        const adminData = await User.findById(id);
        return res.render('home', { admin: adminData });
    } catch (error) {
        console.log("object dashboard Admin", error.message);
    }
};

const adminDashboard = async (req, res) => {
    try {
        const id = req.session.adminId;
        const adminData = await User.findById(id);
        // return res.render('new-user', { admin: adminData });
        // const users = await User.find({is_Verified: '0'});
        const users = await User.find();
        // console.log("object", users)
        return res.render('dashboard', { users: users, admin: adminData });
    } catch (error) {
        console.log("object adminDashboard ", error.message);
    }
}

const adminLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log("Error -- ", error.message);
    }
}

const forgetLoad = async (req, res) => {
    try {
        return res.render("forget");
    } catch (error) {
        console.log("object forgetLoad", error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const adminData = await User.findOne({ email: email });
        if (adminData) {
            if (adminData.is_Admin !== '1') {
                return res.render("forget", { message: "Email is incorrect" })
            } else {
                const randomstr = randomstring.generate();
                const updateAdmin = await User.updateOne(
                    { email: email },
                    {
                        $set: { token: randomstr }
                    }
                );
                sendResetAdminPasswordMail(updateAdmin.name, email, randomstr);
                return res.render("forget", { message: "Please check your mail to reset your password" })
            }
        } else {
            return res.render("forget", { message: "Email is incorrect .." })
        }
    } catch (error) {
        console.log("object forgetVerify", error.message);
    }
}

const forgetPsswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const adminToken = await User.findOne({ token: token });
        if (adminToken) {
            return res.render('forget-password', { admin_id: adminToken._id });
        } else {
            return res.render('404', { message: "Invalid Link" })
        }
    } catch (error) {
        console.log("object forgetPsswordLoad", error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const { admin_id, password } = req.body;
        const spassword = await securePassword(password);
        const updatePassword = await User.findByIdAndUpdate({ _id: admin_id }, {
            password: spassword,
            token: ''
        });
        if (updatePassword) {
            console.log("object password updated successfully ....")
            return res.redirect("/admin")
        } else {
            return res.render("forget-password", { message: "Password not updated" })
        }
    } catch (error) {
        console.log("object resetPassword", error.message);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const newUserLoad = async (req, res) => {
    try {
        const id = req.session.adminId;
        const adminData = await User.findById(id);
        return res.render('new-user', { admin: adminData });
    } catch (error) {
        console.log("object newUserLoad", error.message);
    }
}


const addNewUserByAdmin = async (req, res) => {
    // console.log("object addNewUserByAdmin", req.body);
    try {
        const checkUser = await User.findOne({ email: req.body.email });
        if (!req.file.filename) {
            return res.render("new-user", { message: "Please select the Image." })
        }
        if (!checkUser) {
            const { name, email, mno } = req.body;
            const password = randomstring.generate(8);
            const spassword = await securePassword(password);
            const addUser = await User({
                name: name,
                email: email,
                mobile: mno,
                image: req.file.filename,
                password: spassword,
                is_Admin: 0
            });
            const savedUser = await addUser.save();
            console.log("object savedUser", savedUser)
            if (!savedUser) {
                return res.render("new-user", { message: "User not created.." })
            } else {
                await addNewUser(name, email, password, savedUser._id);
                return res.redirect("/admin/dashboard");
            }
        } else {
            res.render("new-user", {
                message: "User Exist..."
            });
        }
    } catch (error) {
        console.log("object addNewUserByAdmin", error.message);
    }
}

/**
 * Here we create a controller for show the Edit User Page 
 */
const loadEditUserPage = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            return res.render("edit-user", { user: userData });
        } else {
            return res.redirect("/admin/new-user");
        }
    } catch (error) {
        console.log("object loadEditUserPage", error.message);
    }
}

/**
 * Here we create controller for update the user data by admin.
 */
const editUserByAdmin = async (req, res) => {
    try {
        const { user_id, name, email, mno, is_Admin, verify } = req.body;
        if (req.file) {
            const userData = await User.findByIdAndUpdate({ _id: user_id }, {
                name: name, email: email, mobile: mno, image: req.file.filename, is_Admin: is_Admin, is_Verified: verify
            });
        } else {
            const userData = await User.findByIdAndUpdate({ _id: user_id }, {
                name: name, email: email, mobile: mno, is_Admin: is_Admin, is_Verified: verify
            });
        }
        return res.redirect('/admin/dashoard');
    } catch (error) {
        console.log("object editUserByAdmin", error.message);
    }
}

/**
 * Here we create controller for delete the user data by admin using Id
 */
const deleteUserByAdmin = async (req, res) => {
    try {
        const id = req.query.id;

        // const delete = 
    } catch (error) {
        console.log("object deleteUserByAdmin", error.message);
    }
}


/**
 * Here we export all users in excel-format.
 * @param {*} req 
 * @param {*} res 
 */
const exportAllUsers = async (req, res) => {
    try {
        // here we create a WorkBook
        const workbook = new excelJs.Workbook();
        // Add a Worksheet
        const worksheet = workbook.addWorksheet('Users-Data');

        const path = "./public/files";  // Path to download excel

        // here we add columns into excels.
        worksheet.columns = [
            { header: 'SNO', key: 's_no', width: 10 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'Email', key: 'email', width: 10, },
            { header: 'Mobile', key: 'mobile', width: 10, },
            { header: 'Image', key: 'image', width: 10, },
            { header: 'is_Admin', key: 'is_Admin', width: 10, },
            { header: 'is_Verified', key: 'is_Verified', width: 10, },
            { header: 'is_Admin', key: 'status', width: 10, },
        ]

        let counter = 1;
        const userData = await User.find({ is_Admin: '0' });
        userData.forEach((user) => {
            user.s_no = counter;
            worksheet.addRow(user);
            user.s_no = counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });

        // res.setHeader(
        //     "Content-Type",
        //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        // );

        // res.setHeader(
        //     "Content-Disposition",
        //     `attachment;filename=users.xlsx`
        // );

        return workbook.xlsx.writeFile(`${path}/users.xlsx`).then(() => {
            res.send({
                status: "success",
                message: "file successfully downloaded",
                path: `${path}/users.xlsx`,
            });
        })




    } catch (error) {
        console.log("object exportAllUsers", error.message);
    }
}

/**
 * Here we import all user into PDF Format.
 * @param {*} req 
 * @param {*} res 
 */
const exportAllUsersPDF = async (req, res) => {
    try {
        const users = await User.find({is_Admin: '0'});
        console.log("object users", users);
        const data = {
            users: users
        };
        const filePathName = path.resolve(__dirname, '../views/admin/htmlTopdf.ejs')
        console.log("filePathName", filePathName);

        let options = {
            format: 'Letter'
        }

        const htmlString = fs.readFileSync(filePathName).toString();
        const ejsData = ejs.render(htmlString, data);
        pdf.create(ejsData, options).toFile('users.pdf', (err, response)=>{
            if(err) console.log("ToFile", err.message);
            console.log("PDF File Generted");
        })

    } catch (error) {
        console.log("exportAllUsersPDF", error.message);
    }
}

module.exports = {
    loadLogin, verifyLogin,
    dashboard, adminDashboard, adminLogout,
    forgetLoad, forgetVerify,
    forgetPsswordLoad, resetPassword,
    newUserLoad, addNewUserByAdmin,
    loadEditUserPage, editUserByAdmin,
    deleteUserByAdmin,
    exportAllUsers, exportAllUsersPDF
}