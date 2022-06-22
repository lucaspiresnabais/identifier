require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { appendFile } = require("fs");
dotenv.config();
/*node appendFile.js*/
const validatePaquete = async (req, res) => {
  const { data } = req.body;
  /* const { idVisita } = req.params; */
  const idVisita = data.split(":")[0];
  const paqueteLeido = data.split(":")[1];

  try {
    const visita = await Visita.findById(idVisita);

    if (!visita) {
      const message = "Visita no encontrada";
      console.log(message);
      return res.status(404).send({ error: message });
    }

    if (visita.qrpaquete !== paqueteLeido) {
      const message = `El paquete no corresponde a esta visita`;
      console.log(
        message,
        "visita.qrpaquete:",
        visita.qrpaquete,
        "paqueteleido:",
        paqueteLeido
      );
      return res.status(422).send({ error: message });
    }

    visita.estado = "Habilitado"; /* ara probar, luego: ejecutado */
    /* visita.geo = geo; */
    res.send(visita);
    await visita.save();
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};

module.exports = { validatePaquete };
