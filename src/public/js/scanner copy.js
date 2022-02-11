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
  })
    .then((response) => {
      if (!response.ok) throw Error(response);

      const respuesta = JSON.stringify(response.json());
      console.log(respuesta);
      document.body.innerHTML = `<h1>Aprobado</h1> <p> <h2>Entregar pedido</h2><p><h3>${respuesta.nombre}</h3> <p id="demo" onclick="myFunction()" > Quiero scanear la entrega</p> 
    <button name="button" value="OK" type="button" onclick="myFunction()">Click Here</button>  
      `;

      return response;
    })
    .catch((error) => {
      const respuesta = error;
      console.log(respuesta);
      document.body.innerHTML = `<h1>NO ENTREGAR </h1> <p> <h2>Ha habido un error</h2><p><h3>${respuesta}</h3>   `;
    });

  qrScanner.stop();
}
