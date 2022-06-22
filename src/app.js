const express = require("express");
var cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const visitaRoutes = require("./routes/visitaRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

var favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname + "public")));
app.use(visitaRoutes);
app.use(pageRoutes);

const ngrok = require("ngrok");
const nodemon = require("nodemon");

/* const ngrokx = ngrok
  .connect({
    proto: "http",
    addr: "3000",
  })
  .then((url) => {
    console.log(`ngrok tunnel opened at: ${url}`);
    process.env.NGROK = url;
    console.log("FFFFFFF", process.env.NGROK);
    nodemon({
      script: "./bin/www",
      exec: `NGROK_URL=${url} node`,
    })
      .on("start", () => {
        console.log("The application has started");
      })
      .on("restart", (files) => {
        console.group("Application restarted due to:");
        files.forEach((file) => console.log(file));
        console.groupEnd();
      })
      .on("quit", () => {
        console.log("The application has quit, closing ngrok tunnel");
        ngrok.kill().then(() => process.exit(0));
      });
  })
  .catch((error) => {
    console.error("Error opening ngrok tunnel: ", error);
    process.exitCode = 1;
  });
 */
module.exports = { app };
