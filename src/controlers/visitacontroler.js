require("../models/Modelos");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const Param = mongoose.model("Parametria");
const Entes = mongoose.model("Entes");
const LogVisitas = mongoose.model("LogVisitas");
const mailManager = require("../helpers/mailManager");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { enviarMsgVisita } = require("../whatsappManager");
dotenv.config();

const getVisitabyId = async (req, res) => {
  const { idVisita } = req.params;
  try {
    const visita = await Visita.findById(idVisita);
    res.send(visita);
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: "Visita no encontrada" });
  }
};

const getVisitabyIdReceptor = async (req, res) => {
  try {
    const visitas = await Visita.find({ idReceptor: req.query.idReceptor });
    res.send(visitas);
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: "Ocurrió un error" });
  }
};

const getVisitabyIdVisitador = async (req, res) => {
  const { estado } = req.body;

  qry = { idVisitador: req.query.idVisitador };

  if (estado) {
    qry.estado = estado;
  }

  try {
    const visitas = await Visita.find(qry);
    res.send(visitas);
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: "Ocurrió un error" });
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
    qrpaquete,
  } = req.body;

  /* const valida = await validaautorizacion(user, password, ente);
  if (valida == "OK") {
   */
  let estado = "Habilitado";

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
      qrpaquete,
    });

    await visita.save();

    const wente = await Entes.findOne({ ente: ente });

    const param = await Param.findOne({ entex: wente._id });

    var textoFinal = param.textoWapp;
    datosmsg.forEach(
      (element) =>
        (textoFinal = textoFinal.replace(element.clave, element.valor))
    );

    let responseMessage = visita;

    const data = `${visita._id}`;

    const qrData = await qrManager.saveQR(data);

    const link = `${process.env.HOST}/pages/scanner`;
    const imageName = data + ".png";
    /* await mailManager.sendMail({ imageName, link }, mailReceptor);*/

    let whatsappdestino = whatsapp.slice(1);
    if (whatsappdestino.length > 8) {
      const ext = "@c.us";
      whatsappdestino = whatsappdestino + ext;
      const whatsappMessage = qrData[1];

      enviarMsgVisita(whatsappdestino.toString(), whatsappMessage, textoFinal);
    }

    res.send(responseMessage);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
};
/*}  else res.status(422).send({ error: valida });*/

const syncVisitasUp = async (req, res) => {
  const { idVisitador } = req.params;
  array = req.body;
  console.log(array);
  try {
    /** recorro el array de visitas para actualizar */

    for (let i = 0; i < array.length; i++) {
      console.log(`${i} id:${array[i].qrLeido}`);

      /** Guardado en el log */
      Log = new LogVisitas({
        user: array[i].user,
        idVisitador: array[i].idVisitador,
        qrLeido: array[i].qrLeido,
        dateCaptura: array[i].dateCaptura,
        resultado: array[i].resultado,
      });
      await Log.save();

      try {
        const visita = await Visita.findOneAndUpdate(
          { idReceptor: array[i].qrLeido },
          { estado: "Ejecutado", ejecutado: "offline" }
        );
      } catch (err) {}
    }

    res.status(200).send({ Resultado: "OK" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: "Algo salio mal" });
  }
};

module.exports = {
  getVisitabyId,
  addVisita,
  getVisitabyIdReceptor,
  getVisitabyIdVisitador,
  syncVisitasUp,
};
