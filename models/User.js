const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
  uid: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
    required: true
  }
});

const User = mongoose.model("users", UserModel);

module.exports = User;
