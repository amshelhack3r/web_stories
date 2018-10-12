const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
  uid: {
    type: String,
    required: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  password: {
    type: String
  },

  avatar: {
    type: String
  }
});

const User = mongoose.model("users", UserModel);

module.exports = User;
