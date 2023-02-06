import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const handleOpen = () => {
  console.log("DB Connected⭐");
};

const handleError = () => {
  console.log("Error😧");
};

mongoose.connection.once("open", handleOpen);
mongoose.connection.on("error", handleError);
