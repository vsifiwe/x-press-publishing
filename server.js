const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
const app = express();
const port = process.env.PORT || 3000;

const apiRouter = require("./api/api");

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  // only use in development
  app.use(errorhandler());
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
