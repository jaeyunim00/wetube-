import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: true },
  username: { type: String, unique: true },
  password: { type: String },
  name: { type: String },
  location: String,
});

userScheme.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const userModel = mongoose.model("User", userScheme);

export default userModel;
