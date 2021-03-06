require("./models/Modelos");
const mongoose = require("mongoose");
const Parametria = mongoose.model("Parametria");
const Entes = mongoose.model("Entes");
const Users = mongoose.model("Users");
const Roles = mongoose.model("Roles");
const mongoUri = "mongodb://0.0.0.0:27017/pruebampn1";
const util = require("util");
const sleep = util.promisify(setTimeout);
const generateApiKey = require("generate-api-key");

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  /* useCreateIndex: true, */
  useUnifiedTopology: true,
  /*  useFindAndModify: false, */
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

async function poblar(callback) {
  await Parametria.deleteMany({});
  await Users.deleteMany({});
  await Entes.deleteMany({});
  await Roles.deleteMany({});

  console.log("borre todo");

  let rol = new Roles({
    rol: "Admin",
  });
  await rol.save();
  console.log("creo el rol", rol);

  rol = new Roles({
    rol: "Visitador",
  });
  await rol.save();
  console.log("creo el rol", rol);

  const ente = new Entes({
    ente: "Ente1",
    sector: "Sector1",
    servicio: "Servicio1",
  });
  await ente.save();
  console.log("creo el ente", ente);

  const entex = await Entes.findOne({ ente: "Ente1" });
  let rolx = await Roles.findOne({ rol: "Admin" });

  let aapiKey = generateApiKey({ method: "string", length: 30 });
  let user = new Users({
    user: "Admin1",
    password: "1234",
    apiKey: aapiKey,
    codEnte: entex,
    roles: rolx,
  });
  await user.save();
  console.log("creo el user", user);

  rolx = await Roles.findOne({ rol: "Visitador" });

  let vapiKey = generateApiKey({ method: "string", length: 30 });
  user = new Users({
    user: "Visitador1",
    password: "1234",
    apiKey: vapiKey,
    codEnte: entex,
    roles: rolx,
  });
  await user.save();

  console.log("creo el user", user);

  const parametria = new Parametria({
    entex: entex._id,
    textoWapp:
      "Hola, te estamos enviando este QR para que le muestres al repartidor al momento de entregarte &entrega que te llevaremos por tu compra en &origen.",
  });
  parametria.entex = entex._id;
  await parametria.save();
  console.log("creo la parametria", parametria);

  return callback();
}
poblar(() => {
  mongoose.connection.close();
});
