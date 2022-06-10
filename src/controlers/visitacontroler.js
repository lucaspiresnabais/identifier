require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const Param = mongoose.model("Parametria");
const Entes = mongoose.model("Entes");
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
    idReceptor,
    idVisitador,
    mailVisitador,
    mailReceptor,
    whatsapp,
    nroDni,
    tipoDni,
    nombre,
    diaHoraDesde,
    diaHoraHasta,
    ente,
    datosmsg,
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
      idReceptor,
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
      ente,
      datosmsg,
    });

    await visita.save();

    const wente = await Entes.findOne({ ente: ente });
    console.log("*********", wente._id);
    const param = await Param.findOne({ entex: wente._id });

    var textoFinal = param.textoWapp;
    datosmsg.forEach(
      (element) =>
        (textoFinal = textoFinal.replace(element.clave, element.valor))
    );
    await mailManager.sendMail({ link }, mailReceptor);

    let responseMessage = `Se ha agregado la visita: ${visita} 
              y envíado el mail al receptor`;

    /*    const data = `${visita._id}` + ":" + `${visita.idVisitador}`; */
    const data = `${visita._id}`;

    const qrData = await qrManager.saveQR(data);

    let whatsappdestino = whatsapp.slice(1);
    if (whatsappdestino.length > 8) {
      const ext = "@c.us";
      whatsappdestino = whatsappdestino + ext;
      const whatsappMessage = qrData[1];

      enviarMsgVisita(whatsappdestino.toString(), whatsappMessage, textoFinal);

      /*enviarMsgVisita("5491155701153-1587230635@g.us", whatsappMessage);*/
    }

    res.send(responseMessage);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};
/*}  else res.status(422).send({ error: valida });*/

module.exports = { getVisita, addVisita };
