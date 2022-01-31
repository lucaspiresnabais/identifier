require("./models/Modelos");
const mongoose = require("mongoose");
const parametria = mongoose.model("Parametria");
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

/*const poblar= require('./cargainicial')*/

function PoblarParam() {
  let date_ob = new Date();

  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let time =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  console.log(time);

  const borrar = async (xente) => {
    const param = await parametria.deleteMany(
      { codEnte: xente } || { ente: "Ente1" }
    );
    console.log(param);
    const crear = async () => {
      const Parametria = new parametria({
        codEnte: 1,
        codSector: 1,
        codServicio: 1,
        ente: "Ente1",
        sector: "Sector1",
        servicio: "Servicio1",
        timeStamp: new Date(),
        textoWapp:
          "Hola, le estamos enviando un QR para que muestre al repatidor al momento de la entrega de SUPRODUCTO",
      });
      Parametria.save();
    };
    crear();
  };

  borrar(1);

  return "Parametria Poblada";
}

console.log(PoblarParam());
