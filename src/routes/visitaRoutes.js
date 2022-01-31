require("../models/Modelos");
const express = require("express");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const Parametria = mongoose.model("Parametria");
const router = express.Router();
const mailManager = require("../helpers/mailManager");
const qrManager = require("../helpers/qrManager");
const dotenv = require("dotenv");
const { enviarMsg } = require("../whatsappManager");
dotenv.config();
/*router.use(corser.create()) */
router.get("/:idVisita", async (req, res) => {
  console.log("paso por el get del index");
  const { idVisita } = req.params;
  try {
    const visita = await Visita.findById(idVisita);
    res.send(visita);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
});

/*router.get('/link/:idVisita', async (req, res) => {
    const { idVisita } = req.params;
    try { 
        const visita = await Visita.findById(idVisita)
        
        if (!visita) {
            return res.status(400).send({
                error: "La visita no existe"
            })
        }

        res.send(`host/pages/scanner/${idVisita}`)
    } catch (err) {
        console.log(err)
        res.status(422).send({
            error: "An error has occurred"
        });
    }
})*/

router.post("/addVisita", async (req, res) => {
  console.log("paso por el post del index");
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

    if (visita.idVisitador) {
      const data = `${visita._id}${idVisitador}`;
      const qrData = await qrManager.saveQR(data);

      const imageName = qrData[0];
      const whatsappMessage = qrData[1];
      /* console.log('******', Date())
            console.log(whatsappMessage)
            console.log([qrData]) */
      enviarMsg("5491155701153@c.us", whatsappMessage);
      /*enviarMsg("5491149171652@c.us", whatsappMessage); */
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
});

router.patch("/addVisitador/:idVisita", async (req, res) => {
  const { idVisitador, mailVisitador } = req.body;
  const { idVisita } = req.params;

  if (!idVisitador) {
    /*  document.body.innerHTML +=  response.json() */
    return res.status(400).send({ error: "idVisitador es obligatorio" });
  }

  /*if (!mailVisitador) {
        return res.status(400).send({error: 'mailVisitador es obligatorio'});
     }*/

  try {
    const visita = await Visita.findById(idVisita);

    if (!visita) {
      return res.status(404).send({ error: "La visita no existe" });
    }

    if (visita.idVisitador) {
      return res.status(400).send({ error: "La visita ya posee un visitador" });
    }

    if (visita.estado != "No habilitado") {
      return res
        .status(400)
        .send({ error: `La visita se encuentra en estado ${visita.estado}` });
    }

    visita.idVisitador = idVisitador;
    visita.estado = "Habilitado";
    visita.mailVisitador = mailVisitador;
    await visita.save();

    const data = `${idVisita}:${idVisitador}`;
    const imageName = await qrManager.saveQR(data)[0];

    await mailManager.sendMail({ imageName }, visita.mailVisitador);

    res.send(`Se ha enviado el mail con el QR
            y se ha creado la visita ${visita}`);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: "An error has occurred" });
  }
});

router.patch("/validateVisita/:idVisita", async (req, res) => {
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
});

module.exports = router;
