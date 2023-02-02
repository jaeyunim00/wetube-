import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userScheme.pre("save", async function () {
  console.log("before hashed:", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("after hashed: ", this.password);
});

const userModel = mongoose.model("User", userScheme);

export default userModel;
