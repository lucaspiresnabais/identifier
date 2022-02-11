import QrScanner from "./qr-scanner.min.js";
QrScanner.WORKER_PATH = "./qr-scanner-worker.min.js";

const videoElem = document.getElementById("scanner");

const qrScanner = new QrScanner(
  videoElem,
  async (result) => {
    console.log(result);
    /*     await patchData(result); */
    patchData(result);
    qrScanner.stop();
  },
  (error) => console.log(error)
);

qrScanner.start();

async function patchData(data) {
  const idVisita = data;
  data = data + ":2312132132133213";
  /* const idVisitador = "12324424434324";*/

  /* const host = process.env.NGROK;
   */
  /* const host = `https://5d864fbb3995.ngrok.io`; */
  const host = `http://localhost:3000`;

  const url = `${host}/validateVisita/${idVisita}`;

  let response;

  response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  const respuesta = await response.json();
  console.log(respuesta);
  if (response.ok) {
    document.body.innerHTML = `<h1>Aprobado</h1> <p> <h2>Entregar pedido</h2><p><h3>${respuesta.nombre}</h3> <p id="demo" onclick="myFunction()" > Quiero scanear la entrega</p> 
    <button name="button" value="OK" type="button" onclick="myFunction()">Click Here</button>  
      `;
  } else {
    document.body.innerHTML = `<h1>Rechazado</h1> <p> <h2>No entregar</h2><p><h3>${respuesta.error}</h3> <p id="demo" onclick="myFunction()" > Quiero scanear la entrega</p> 
      <button name="button" value="OK" type="button" onclick="myFunction()">Click Here</button> 
      `;
  }

  qrScanner.stop();
}
