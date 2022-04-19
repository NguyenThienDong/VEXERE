const express = require("express");
const config = require("config");
const cors = require("cors");
const path = require("path");

require("./db/connect");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(userRouter);

const PORT = process.env.PORT || config.get("port");

app.listen(PORT, () => {
  console.log(`Server started in ${config.get("url")}`);
});
