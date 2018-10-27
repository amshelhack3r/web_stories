const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoryModel = new Schema({
  title: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "public"
  },
  allowComments: {
    type: Boolean,
    default: true
  },

  published_on: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  comments: [
    {
      commentBody: {
        type: String
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      commentDate: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

const Story = mongoose.model("stories", StoryModel);

module.exports = Story;
