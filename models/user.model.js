const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["verified", "NotVerified"],
    default: "NotVerified",
  },
});

const Usermodel = mongoose.model("user", userSchema);

module.exports = {
  Usermodel,
};
