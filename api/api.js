const express = require("express");

const apiRouter = express.Router();
const artistRouter = require("./artists");
const seriesRouter = require("./series");

apiRouter.use("/artist", artistRouter);
apiRouter.use("/series", seriesRouter);

module.exports = apiRouter;
