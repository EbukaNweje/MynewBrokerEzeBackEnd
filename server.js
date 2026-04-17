const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "config/index.env") });
const Db = process.env.DATABASE;
/* const Db = "mongodb://localhost:27017/db" */

const port = process.env.PORT || 5000;

if (!Db) {
  console.error("FATAL: DATABASE environment variable is not defined.");
}

mongoose
  .connect(Db, {
    /*     useNewUrlParser: true,
    useUnifiedTopology: true */
  })
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

const app = require("./App");

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Please stop the process using it or set a different PORT.`,
    );
  } else {
    console.error("Server failed to start:", err);
  }
  process.exit(1);
});
