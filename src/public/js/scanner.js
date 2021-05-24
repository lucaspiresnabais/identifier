import QrScanner from './qr-scanner.min.js';
QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';

const videoElem = document.getElementById('scanner')

const qrScanner = new QrScanner(videoElem, 
    result => console.log('decoded qr code:', result), 
    error => console.log(error));
    
qrScanner.start().then(

);