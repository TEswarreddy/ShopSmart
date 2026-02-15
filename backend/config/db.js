const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    if (process.env.MONGO_DNS_SERVERS) {
      dns.setServers(
        process.env.MONGO_DNS_SERVERS
          .split(",")
          .map((server) => server.trim())
          .filter(Boolean)
      );
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
