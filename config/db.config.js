"use strict";

const mongoose = require("mongoose");

const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: process.env.dbName,
        }
        mongoose.set("strictQuery", false);
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("MongoDB connected");

    } catch (error) {
        console.log("Error ::", error.message);
    }
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB..")
});

mongoose.connection.on("error", (err) => {
    console.log("Error is ::", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose Connection is disconnected....");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});





module.exports = connectDB;