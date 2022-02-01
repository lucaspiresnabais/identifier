const express = require("express");
const path = require("path");
const morgan = require("morgan");
const visitaRoutes = require("./routes/visitaRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname + "public")));
app.use(visitaRoutes);
app.use(pageRoutes);

module.exports = { app };
