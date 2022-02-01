/*require('./models/Modelos')*/
const { app } = require("./app");
const mongoose = require("mongoose");

/*const app = express();*/
const { iniciarWhatsappBot } = require("./whatsappManager");

iniciarWhatsappBot();

/*const mongoUri = 'mongodb+srv://lucas:mongomongo@cluster0.7eomb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' */
const mongoUri = "mongodb://0.0.0.0:27017/pruebampn1";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("Connected to mongo instance!"))
  .catch((error) => console.log("Error connecting to mongo", error));

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

app.get("/", (req, res) => {
  res.send(`Working`);
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
