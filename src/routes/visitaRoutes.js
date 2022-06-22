const { validaautorizacion } = require("../middleweares/security");
require("../models/Modelos");
const express = require("express");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const Parametria = mongoose.model("Parametria");
const router = express.Router();
const visitaControler = require("../controlers/visitaControler");
const validateVisitaControler = require("../controlers/validateVisitaControler");
const validatePaqueteControler = require("../controlers/validatePaqueteControler");
var ExpressBrute = require("express-brute");
const MongooseStore = require("express-brute-mongoose");
const BruteForceSchema = require("express-brute-mongoose/dist/schema");

const model = mongoose.model(
  "bruteforce",
  new mongoose.Schema(BruteForceSchema)
);
const store = new MongooseStore(model);

var bruteforce = new ExpressBrute(store, {
  freeRetries: 3,
  maxWait: 1 * 10 * 1000,
  lifetime: 10,
}); /**10 segundos */

router.get("/visitabyId/:idVisita", visitaControler.getVisitabyId);
router.get("/VisitabyIdReceptor", visitaControler.getVisitabyIdReceptor);

router.get(
  "/VisitabyIdVisitador/:idVisitador",
  visitaControler.getVisitabyIdVisitador
);
router.post("/addVisita", validaautorizacion, visitaControler.addVisita);
router.post("/syncVisitasUp/:idVisitador", visitaControler.syncVisitasUp);
router.patch("/validateVisita", validateVisitaControler.validateVisita);
router.patch(
  "/validateVisitabrute",
  bruteforce.prevent,
  validateVisitaControler.validateVisita
);
router.patch("/validatePaquete", validatePaqueteControler.validatePaquete);

module.exports = router;
