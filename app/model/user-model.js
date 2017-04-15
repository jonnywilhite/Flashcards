"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    usernameLower: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    var user = this;

    //Only hash pw if it's been modified or is new
    if (!user.isModified('password')) {
        return next();
    }

    //generate SALT
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        //hash pw along w/ new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            //override cleartext pw with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);