const { validaautorizacion } = require("../middleweares/security");
require("../models/Modelos");
const express = require("express");
const mongoose = require("mongoose");
const Visita = mongoose.model("Visita");
const Parametria = mongoose.model("Parametria");
const router = express.Router();
const visitaControler = require("../controlers/visitaControler");

router.get("/:idVisita", visitaControler.getVisita);

router.post("/addVisita", validaautorizacion, visitaControler.addVisita);

router.patch("/validateVisita/:idVisita", visitaControler.validateVisita);

module.exports = router;
