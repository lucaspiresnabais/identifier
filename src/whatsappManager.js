const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const session_path = "./src/helpers/session.json";
const fs = require("fs");
let client;
let sessionData;
const con_session = () => {
  sessionData = fs.readFileSync(session_path);
  sessionData = JSON.parse(sessionData);
  console.log(sessionData, "*****************************");
  client = new Client({
    authStrategy: new LegacySessionAuth({
      session: sessionData,
    }),
  });
  console.log("Creando cliente Whatsapp");
  client.on("disconnected", async () => {
    console.log(
      "me desconecte del Wapp, seguramente lo estan usando en otro dispisitivo"
    );
    await sleep(10000);
    client.initialize();
  });

  client.on("ready", () => {
    console.log("Whats App ready!!");
    reiniciar();
    escucharMsg();
  });

  client.initialize();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
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
    console.log(session);
    sessionData = session;

    fs.writeFile(session_path, JSON.stringify(session), (err) => {
      if (err) console.log("error en wapp autenthicated");
    });
  });
  client.initialize();
  console.log("Listo waManager");
};

module.exports.iniciarWhatsappBot = () => {
  client = new Client({
    authStrategy: new LocalAuth({
      clientID: "Cliente1",
      dataPath: "./.wwebjs_auth",
    }),
  });
  client.on("ready", () => {
    console.log("ready!!");
  });
  client.initialize();

  client.on("qr", (qr) => {
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("disconnected", async () => {
    console.log(
      "me desconecte del Wapp, seguramente lo estan usando en otro dispisitivo"
    );
    await sleep(10000);
    client.initialize();
  });
};

const escucharMsg = () => {
  client.on("message", (msg) => {
    const { from, to, body } = msg;
    console.log(from, to, body, "El serv. no respondera este msg");
    /*enviarMsg(from, "Hola");*/
  });
};

module.exports.enviarMsgVisita = (to, message, caption) => {
  console.log("********************", to, message, caption);

  /* client.initialize(); */
  client.sendMessage(to, message, { caption: caption });
  if (message.mimetype == "image/jpg") {
    qrcode.generate(message.filename, {
      small: true,
    });
  }
};
