require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const mailManager = require("../helpers/mailManager");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { enviarMsgVisita } = require("../whatsappManager");
const { validaautorizacion } = require("../helpers/database");
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

  /* const valida = await validaautorizacion(user, password, ente);
  if (valida == "OK") {
   */ let estado = "Habilitado";
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

    /*    const data = `${visita._id}` + ":" + `${visita.idVisitador}`; */
    const data = `${visita._id}`;

    const qrData = await qrManager.saveQR(data);

    let whatsappdestino = "";
    whatsappdestino = whatsapp.slice(1);
    if (whatsappdestino.length > 8) {
      const ext = "@c.us";
      whatsappdestino = whatsappdestino + ext;
      const whatsappMessage = qrData[1];

      enviarMsgVisita(whatsappdestino.toString(), whatsappMessage);

      /*enviarMsgVisita("5491155701153-1587230635@g.us", whatsappMessage);*/
    }

    res.send(responseMessage);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};
/*}  else res.status(422).send({ error: valida });*/
/* 

   VALIDACION DE VISITA

 */
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

module.exports = { getVisita, addVisita, validateVisita };
