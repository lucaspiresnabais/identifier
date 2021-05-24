const QrScanner = require('qr-scanner');

const videoElem = document.getElementById("scanner")

const qrScanner = new QrScanner(videoElem, result => console.log('decoded qr code:', result));
