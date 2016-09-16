"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

var flashcardSchema = new Schema({
  _user : {
    type : Number,
    ref: 'User'
  },
  question : String,
  answer : String
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
