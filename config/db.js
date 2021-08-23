import mongoose from "mongoose";

function connectDB() {
  mongoose.connect(
    "mongodb+srv://admin-pedro:michelle8266@cluster0.pgogv.mongodb.net/todolistDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

export default connectDB;
