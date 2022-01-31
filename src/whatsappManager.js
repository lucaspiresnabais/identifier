const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const session_path = "./src/helpers/session.json";
const fs = require("fs");

let client;
let sessionData;

const con_session = () => {
  sessionData = fs.readFileSync(session_path);
  sessionData = JSON.parse(sessionData);
  client = new Client({ session: sessionData });
  console.log("toy casi ready");

  client.on("disconnected", () => {
    console.log("me desconecte");
  });

  client.on("ready", () => {
    console.log("ready!!");
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
      samll: true,
    });
  });
  client.on("ready", () => {
    console.log("ready!!");
  });
  client.on("authenticated", (session) => {
    sessionData = session;
    fs.writeFile(session_path, JSON.stringify(session), (err) => {
      if (err) console.log("error");
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
    console.log(from, to, body);
    enviarMsg(from, "Hola");
  });
};

module.exports.enviarMsg = (to, message) => {
  console.log("********************", to, message);
  /* client.initialize(); */
  client.sendMessage(to, message);
};
