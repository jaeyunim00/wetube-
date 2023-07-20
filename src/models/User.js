import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  location: String,
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  ],
});

userScheme.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const userModel = mongoose.model("User", userScheme);

export default userModel;
