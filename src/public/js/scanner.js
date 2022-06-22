import QrScanner from "./qr-scanner.min.js";
QrScanner.WORKER_PATH = "./qr-scanner-worker.min.js";

const videoElem = document.getElementById("scanner");

const qrScanner = new QrScanner(
  videoElem,
  async (result) => {
    console.log("linea 9", result);
    /*     await patchData(result); */
    await patchData(result);
    qrScanner.stop();
  },
  (error) => console.log(error)
);
/**const host = `https://7a95-190-191-103-88.ngrok.io`;*/

const host = "https://mpnservers.pagekite.me";

await qrScanner.start();

async function patchData(data) {
  const idVisita = data;
  //Creamos la instancia
  const urlParams = new URLSearchParams(window.location.search);

  //Accedemos a los valores
  const idVisitador = urlParams.get("idv");

  const url = `${host}/validateVisita`;
  console.log(idVisitador);
  console.log(data);
  let response;

  response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idVisita, idVisitador }),
  });
  console.log(JSON.stringify({ data }), idVisita, response);

  const respuesta = await response.json();
  console.log(idVisita, respuesta);
  if (response.ok) {
    document.body.innerHTML = `<div>
    <h3 style="margin: 10px">A P R O B A D O</h3>
  </div> <p> <h2 style="
  margin: 25px" >Entregar pedido</h2><p><h3 style="
  margin: 25px">Destinatario: ${respuesta.nombre}</h3> 
    <button onclick="scan20('${idVisita}')" > Quiero Scannear el paquete </button>
    <a href=""${host}/pages/scanner""><br>
    <button >Lo entregué- Quiero Sacanear QR para otra entrega</button>
  </a>
    <video width="100%" height="100%" id="scanner2"></video>
          `;
  } else {
    document.body.innerHTML = `<h1 class="error">Rechazado</h1> <p> <h2 class="error"> No entregar</h2><p><h3>${respuesta.error}</h3>  
    <a href=""${host}/pages/scanner"">
    <button>Scannear otro</button>
  </a>`;
  }
}

function scan20(visita) {
  document.body.innerHTML = `<div>
  <h3 style="margin: 10px">Simplemente Scanee el paquete</h3>
</div> <video width="100%" height="100%" id="scanner2" playsinline="" disablepictureinpicture="" style="transform: scaleX(-1);"></video>`;
  const videoElem = document.getElementById("scanner2");

  const qrScanner2 = new QrScanner(
    videoElem,
    async (result) => {
      await patchData2(result, visita);
      qrScanner2.stop();
    },
    (error) => console.log(error)
  );
  qrScanner2.start();
  /*   qrScanner2.stop(); */
}

async function patchData2(data, visita) {
  const idpaquete = data;

  data = visita + ":" + data;
  console.log("data", data);
  /* const idVisitador = "12324424434324";*/

  /* const host = process.env.NGROK;
   */
  /* const host = `https://5d864fbb3995.ngrok.io`; */
  /*  const host = `http://localhost:3000`; */

  const url = `${host}/validatePaquete`;
  console.log(url);
  let response;

  response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  /* const respuesta = await response.json();
   console.log(respuesta);*/
  if (response.ok) {
    document.body.innerHTML = `<h1 style="
    margin: 25px" >Perfecta la entrega</h1> <p> <h2>Entregar pedido</h2><p>
    <a href=""${host}/pages/scanner"">
    <button > Comenzar nueva entrega</button>
  </a>
          `;
  } else {
    document.body.innerHTML = `<div style="
    margin: 25px"><h1 class="error">Rechazado</h1> <p> <h2 class="error">No entregar, el paquete no está aosciado a la entrega</h2><p>  
    <a href=""${host}/pages/scanner"">  
    <button >Comenzar nueva entrega</button>
      </a>
      <br>
      <br>
      <br>

      <button onclick="scan20('${visita}')"> Scannear nuevamente un paquete </button><dDiv>`;
  }
}

window.scan20 = scan20;
