"use strict";

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config.js");

const userRouters = require("./routes/user.routes.js");
const adminRouters = require("./routes/admin.routes.js");

// we create a instance of express.
const app = express();

app.use("/public",express.static('public'));

const PORT = process.env.PORT || 3005;

// Here we register the all user-routes
app.use('/', userRouters);

// Here we register the all admin-routes
app.use("/admin", adminRouters);

const DATABASR_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/';
connectDB(DATABASR_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
    });
}).catch((err) => {
    console.log(">>>>>>>>>>Error is ::", err.message);
});