import QrScanner from "./qr-scanner.min.js";
QrScanner.WORKER_PATH = "./qr-scanner-worker.min.js";

const videoElem = document.getElementById("scanner");

const qrScanner = new QrScanner(
  videoElem,
  async (result) => {
    console.log(result);
    await patchData(result);
    qrScanner.stop();
  },
  (error) => console.log(error)
);

qrScanner.start();

async function patchData(data) {
  const idVisita = data.split(":")[0];
  const idVisitador = data.split(":")[1];

  /* const idVisitador = "12324424434324";*/

  /* const host = process.env.NGROK;
   */
  /* const host = `https://5d864fbb3995.ngrok.io`; */
  const host = `http://localhost:3000`;

  const url = `${host}/validateVisita/${idVisita}:61fe8c3982e0a132dc1dd3b2`;

  let response;
  try {
    response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
  } catch (e) {
    console.log("mmmmm", e.message);
  }
  document.body.innerHTML = JSON.stringify(await response.json());
}
