const express = require("express");
const router = express.Router();
const visitaControler = require("../controlers/visitacontroler");

router.get("/:idVisita", visitaControler.getVisita);

router.post("/addVisita", visitaControler.addVisita);

router.patch("/validateVisita/:idVisita", visitaControler.validateVisita);

module.exports = router;
