"use strict";

const multer = require("multer");
const path = require("path");
console.log("object storage");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImage'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage });

module.exports = upload;