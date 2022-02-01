require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const mailManager = require("../helpers/mailManager");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { enviarMsgVisita } = require("../whatsappManager");
dotenv.config();

const getVisita = async (req, res) => {
  const { idVisita } = req.params;
  try {
    const visita = await Visita.findById(idVisita);
    res.send(visita);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};

const addVisita = async (req, res) => {
  const {
    idVisitador,
    mailVisitador,
    mailReceptor,
    whatsapp,
    nroDni,
    tipoDni,
    nombre,
    diaHoraDesde,
    diaHoraHasta,
  } = req.body;
  let estado = "No habilitado";
  const link = `${process.env.HOST}/pages/scanner`;

  if (!mailReceptor && !whatsapp) {
    console.log("Debe ingresar mail y/o whatsapp");
    return res.status(400).send({
      error: "Debe ingresar mail y/o whatsapp",
    });
  }
  if (!diaHoraDesde || !diaHoraHasta) {
    return res.status(400).send({
      error: "diaHoraDesde y diaHoraHasta son obligatorios",
    });
  }
  if (idVisitador && mailVisitador) {
    estado = "Habilitado";
  }

  try {
    const visita = new Visita({
      idVisitador,
      mailVisitador,
      whatsapp,
      nroDni,
      tipoDni,
      nombre,
      diaHoraDesde,
      diaHoraHasta,
      estado,
      mailReceptor,
    });
    await visita.save();

    await mailManager.sendMail({ link }, mailReceptor);

    let responseMessage = `Se ha agregado la visita: ${visita} 
              y envíado el mail al receptor`;

    const data = `${visita._id}`;
    const qrData = await qrManager.saveQR(data);

    const imageName = qrData[0];
    const whatsappMessage = qrData[1];
    /* console.log('******', Date())
              console.log(whatsappMessage)
              console.log([qrData]) */
    enviarMsgVisita("5491155701153@c.us", whatsappMessage);
    /*enviarMsg("5491149171652@c.us", whatsappMessage); */
    if (visita.idVisitador) {
      if (visita.mailVisitador) {
        await mailManager.sendMail({ imageName }, mailVisitador);
        responseMessage = `Se ha agregado la visita: ${visita} 
                  y se ha enviado el mail al receptor y visitador `;
      }
    }

    res.send(responseMessage);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};

const validateVisita = async (req, res) => {
  const { idVisitador, geo } = req.body;
  const { idVisita } = req.params;

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

    if (!visita.idVisitador || visita.estado !== "Habilitado") {
      const message = `La visita no está en estado 
                  "Habilitado" o no tiene idVisitador`;
      console.log(message);
      return res.status(422).send({ error: message });
    }

    if (visita.idVisitador != idVisitador) {
      const message = "El visitador no es el indicado!";
      console.log(message);
      return res.status(400).send({ error: message });
    }

    visita.estado = "Ejecutado";
    visita.geo = geo;
    await visita.save();
    res.send(visita);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};

module.exports = { getVisita, addVisita, validateVisita };
