const axios = require('axios');
const path = require('path');
const fs = require('fs')
const FileType = require("file-type");

async function saveQR(dataToEncode) {
    const response = await axios.get(
        `http://api.qrserver.com/v1/create-qr-code/?data=${dataToEncode}&size=300x300`,
        { responseType: 'arraybuffer' }
    );
    const buffer = Buffer.from(response.data);
    const fileType = await FileType.fromBuffer(buffer);
    
    const outputFileName = `${dataToEncode}.${fileType.ext}`
    const filePath = path.join(`${__dirname}/../public/images/${outputFileName}`)
    fs.createWriteStream(filePath).write(buffer);

    return outputFileName;
}

module.exports = { saveQR }