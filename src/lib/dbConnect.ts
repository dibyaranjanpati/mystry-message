import mongoose from "mongoose";

type ConnectionObject = {
  isConneted?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConneted) {
    console.log("Data is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConneted = db.connections[0].readyState;

    console.log("Database connect successfully");
  } catch (error) {
    console.log("Db connection faild", error);

    process.exit(1);
  }
}

export default dbConnect;
