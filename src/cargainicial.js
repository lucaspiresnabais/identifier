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
