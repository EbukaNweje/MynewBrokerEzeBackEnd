const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/index.env" });
const Db = process.env.DATABASE;
/* const Db = "mongodb://localhost:27017/db" */

const port = process.env.PORT || 5000;

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
