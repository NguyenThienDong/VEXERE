const mongoose = require("mongoose");
const config = require("config");
const dbUrl = config.get("dbUrl");

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect DB success!..."))
  .catch((error) => console.log(error.message));
