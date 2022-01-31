const { MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FileType = require("file-type");

async function saveQR(dataToEncode) {
  const response = await axios.get(
    `http://api.qrserver.com/v1/create-qr-code/?data=${dataToEncode}&size=300x300`,
    { responseType: "arraybuffer" }
  );
  console.log(response.data);
  const buffer = Buffer.from(response.data);
  const fileType = await FileType.fromBuffer(buffer);
  console.log(fileType);
  const outputFileName = `${dataToEncode}.${fileType.ext}`;
  const filePath = path.join(`${__dirname}/../public/images/${outputFileName}`);
  fs.createWriteStream(filePath).write(buffer);

  /* generar archivo para wapp*/

  const msgImg = new MessageMedia(
    "image/jpg",
    buffer.toString("base64"),
    "pepe"
  );

  return [outputFileName, msgImg];
}

module.exports = { saveQR };
