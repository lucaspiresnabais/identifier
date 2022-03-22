require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { validaautorizacion } = require("../helpers/database");
dotenv.config();

const validateVisita = async (req, res) => {
  const { data } = req.body;
  /* const { idVisita } = req.params; */
  const idVisita = data.split(":")[0];
  const idVisitador = data.split(":")[1];
  console.log(idVisita, idVisitador);
  if (!idVisitador) {
    return res.status(400).send({ error: "El idVisitador es obligatorio" });
  }

  try {
    const visita = await Visita.findById(idVisita);

    if (!visita) {
      const message = "Visita no encontrada";
      console.log(message);
      return res.status(404).send({ error: message });
    }

    console.log(visita.idVisitador, visita.estado);
    if (!visita.idVisitador || visita.estado !== "Habilitado") {
      const message = `La visita no está en estado "Habilitado" o no tiene idVisitador`;
      console.log(message);
      return res.status(422).send({ error: message });
    }

    if (visita.idVisitador != idVisitador) {
      const message = "El visitador no es el indicado!";
      console.log(message);
      return res.status(400).send({ error: message });
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


module.exports = { validateVisita };
