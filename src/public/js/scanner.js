import QrScanner from './qr-scanner.min.js';
QrScanner.WORKER_PATH = './qr-scanner-worker.min.js';

const videoElem = document.getElementById('scanner')

const qrScanner = new QrScanner(videoElem, 
    async result => { 
        console.log(result)
        await patchData(result);
        qrScanner.stop();
    }, 
    error => console.log(error));
    
qrScanner.start()

async function patchData(data) {
    const idVisita = data.split(':')[0];
    const idVisitador = data.split(':')[1];
    const host = `https://5d864fbb3995.ngrok.io`
    const url = `${host}/validateVisita/${idVisita}`

    const response = await fetch (url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({idVisitador})
    })
    console.log(await response.json())
}