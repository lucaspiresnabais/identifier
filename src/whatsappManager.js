const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const session_path = "./src/helpers/session.json";
const fs = require("fs");

let client;
let sessionData;

const con_session = () => {
  sessionData = fs.readFileSync(session_path);
  sessionData = JSON.parse(sessionData);
  console.log(sessionData, "*****************************");
  client = new Client({ session: sessionData });
  console.log("Creando cliente Whatsapp");

  client.on("disconnected", () => {
    console.log(
      "me desconecte del Wapp, seguramente lo estan usando en otro dispisitivo"
    );
  });

  client.on("ready", () => {
    console.log("Whats App ready!!");
    escucharMsg();
  });

  client.initialize();
};

const sin_session = () => {
  /* Sin session */
  client = new Client();
  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    console.log(qr);
    qrcode.generate(qr, {
      small: true,
    });
  });
  client.on("ready", () => {
    console.log("Whats App ready!!");
  });
  client.on("authenticated", (session) => {
    sessionData = session;
    fs.writeFile(session_path, JSON.stringify(session), (err) => {
      if (err) console.log("error en wapp autenthicated");
    });
  });
  client.initialize();
  console.log("Listo waManager");
};

module.exports.iniciarWhatsappBot = () => {
  fs.existsSync(session_path) ? con_session() : sin_session();
};

const escucharMsg = () => {
  client.on("message", (msg) => {
    const { from, to, body } = msg;
    console.log(from, to, body, "El serv. no responde msg");
    /*enviarMsg(from, "Hola");*/
  });
};

module.exports.enviarMsgVisita = (to, message) => {
  console.log("********************", to, message);

  /* client.initialize(); */
  client.sendMessage(to, message);
  if (message.mimetype == "image/jpg") {
    qrcode.generate(message.filename, {
      small: true,
    });
  }
};
