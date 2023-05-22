"use strict";

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_Admin: {
        type: String,
        required: true,
        // default
    },
    is_Verified: {
        type: String,
        default: 0
    },
    token: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'Active'
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User;
