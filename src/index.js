/*require('./models/Modelos')*/
const express = require("express");
const mongoose = require("mongoose");
const visitaRoutes = require("./routes/visitaRoutes");
const pageRoutes = require("./routes/pageRoutes");
const path = require("path");
const app = express();
const { iniciarWhatsappBot } = require("./whatsappManager");

iniciarWhatsappBot();

app.use(express.json());
app.use(express.static(path.join(__dirname + "public")));
app.use(visitaRoutes);
app.use(pageRoutes);
/* app.use(corser.create()); */

/*const mongoUri = 'mongodb+srv://lucas:mongomongo@cluster0.7eomb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' */
const mongoUri = "mongodb://0.0.0.0:27017/pruebampn1";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

app.get("/", (req, res) => {
  res.send(`Working`);
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
