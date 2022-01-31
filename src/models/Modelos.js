const mongoose = require("mongoose");

const visitaSchema = new mongoose.Schema({
  idVisitador: {
    type: String,
  },
  mailVisitador: {
    type: String,
  },
  tipoDni: {
    type: String,
  },
  nroDni: {
    type: String,
  },
  nombre: {
    type: String,
  },
  mailReceptor: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  diaHoraDesde: {
    type: Number,
  },
  diaHoraHasta: {
    type: Number,
  },
  estado: {
    type: String,
  },
});

const parametria = new mongoose.Schema({
  codEnte: {
    type: Number,
  },
  codSector: {
    type: Number,
  },
  codServicio: {
    type: Number,
  },
  ente: {
    type: String,
  },
  sector: {
    type: String,
  },
  servicio: {
    type: String,
  },
  envWapp: {
    type: Boolean,
    default: true,
  },
  envMail: {
    type: Boolean,
    default: true,
  },
  estadoServicio: {
    type: String /*Habilidato,Suspendido, bloqueado*/,
  },
  textoWapp: {
    type: String,
  },
  textoMail: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
});

mongoose.model("Visita", visitaSchema);
mongoose.model("Parametria", parametria);
