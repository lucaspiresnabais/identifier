require("../models/Modelos");
const mongoose = require("mongoose");
const Entes = mongoose.model("Entes");
const Users = mongoose.model("Users");

module.exports.validaautorizacion = async (req, res, next) => {
  const { ente, user, password } = req.body;
  console.log("SEEEECUUURIITTYYY", user, password, ente);
  console.log(JSON.stringify(req.headers));
  const wuser = await Users.findOne({ user: user })
    .populate("roles")
    .populate("codEnte");
  console.log(wuser);

  if (!wuser || wuser.roles[0].rol !== "Admin")
    return res
      .status(403)
      .json({ message: "usuario Inexistente o sin permisos" });
  else {
    if (password !== wuser.password)
      return res.status(403).json({ message: "password invalida" });
    else {
      if (wuser.codEnte.ente) {
        if (ente !== wuser.codEnte.ente)
          return res
            .status(403)
            .json({ message: "Ente no corresponde a usuario" });
        else next();
      } else
        return res.status(403).json({ message: "Ente invalido o equivocado" });
    }
  }
};
