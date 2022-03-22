require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { validaautorizacion } = require("../helpers/database");
dotenv.config();

const validatePaquete = async (req, res) => {
  const { data } = req.body;
  /* const { idVisita } = req.params; */
  const idVisita = data.split(":")[0];
  const paqueteLeido = data.split(":")[1];
  console.log("validatePaquete", idVisita, paqueteLeido);

  try {
    const visita = await Visita.findById(idVisita);

    if (!visita) {
      const message = "Visita no encontrada";
      console.log(message);
      return res.status(404).send({ error: message });
    }
    console.log("linea 24 ", visita.qrpaquete, paqueteLeido);
    if (visita.qrpaquete !== paqueteLeido) {
      const message = `El paquete no corresponde a esta visita`;
      console.log(message);
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
