// registrando o service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
      console.log('Service worker registrado! 😎', reg);
    } catch (err) {
      console.log('😢 Service worker registro falhou: ', err);
    }
  });
}

// configurando as constraints do video stream
var constraints = { video: { facingMode: "user" }, audio: false };

function toggleCamera() {
  if (constraints.video.facingMode === "user") {
    constraints.video.facingMode = "environment";
  } else {
    constraints.video.facingMode = "user";
  }
}

// capturando os elementos em tela
const cameraView = document.querySelector("#camera-view"),
  cameraOutput = document.querySelector("#camera-output"),
  cameraSensor = document.querySelector("#camera-sensor"),
  cameraTrigger = document.querySelector("#camera-trigger"),
  trocarCam = document.querySelector("#camera-change");

// Estabelecendo o acesso à câmera e inicializando a visualização
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Ocorreu um erro.", error);
    });
}

// Função para tirar foto
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

// TROCAR CÂMERA (EXATAMENTE COMO VOCÊ FEZ, SÓ PARANDO O STREAM)
trocarCam.onclick = function () {

  // troca o modo frontal/traseira
  toggleCamera();

  // para o stream atual
  let stream = cameraView.srcObject;
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }

  // reinicia com a nova câmera
  cameraStart();
}

// Carrega imagem de câmera quando a janela carregar
window.addEventListener("load", cameraStart, false);
