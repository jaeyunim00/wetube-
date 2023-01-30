import mongoose from "mongoose";

mongoose.connect(
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2"
);

const handleOpen = () => {
  console.log("DB Connected⭐");
};

const handleError = () => {
  console.log("Error😧");
};

mongoose.connection.once("open", handleOpen);
mongoose.connection.on("error", handleError);
