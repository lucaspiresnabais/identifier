require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const LogVisitas = mongoose.model("LogVisitas");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
dotenv.config();

const validateVisita = async (req, res) => {
  const { idVisita, idVisitador } = req.body;
  console.log(idVisita, idVisitador);
  /* const { idVisita } = req.params; */

  if (!idVisitador) {
    return res.status(400).send({ error: "El idVisitador es obligatorio" });
  }

  try {
    const visita = await Visita.findById(idVisita);

    /** Guardado en el log */
    Log = new LogVisitas({
      user: "user1",
      idVisitador: idVisitador,
      qrLeido: idVisita,
      dateCaptura: Date(),
    });
    await Log.save();

    if (!visita) {
      const message = "Visita no encontrada";
      console.log(message);
      return res.status(404).send({ error: message });
    }

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

    visita.estado = "Habilitado"; /* para probar, luego: Ejecutado */
    /* visita.geo = geo; */
    Log.resultado = "Ejecutado";
    await Log.save();

    res.send(visita);
    await visita.save();
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};

module.exports = { validateVisita };
