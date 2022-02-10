require("../models/Modelos");
const mongoose = require("mongoose");
const Entes = mongoose.model("Entes");
const Users = mongoose.model("Users");

module.exports.validaautorizacion = async (user, password, ente) => {
  console.log(user, password, ente);
  const wuser = await Users.findOne({ user: user })
    .populate("roles")
    .populate("codEnte");
  console.log(wuser);

  if (!wuser || wuser.roles[0].rol !== "Admin")
    return "usuario Inexistente o sin permisos";
  else {
    if (password !== wuser.password) return "password invalida";
    else {
      /* const wente = await Entes.findOne({ ente: ente }); */
      console.log(wuser.codEnte.ente);
      if (wuser.codEnte.ente) {
        if (ente !== wuser.codEnte.ente) return "Ente no corresponde a usuario";
        else return "OK";
      } else return "Ente invalido o equivocado";
    }
  }
};
